import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient('mongodb+srv://spadmaprashath_db_user:Padma123@food-delivery.0bd2vyd.mongodb.net/?retryWrites=true&w=majority')
db = client['fooddelivery']

# Collections - Only restaurants and menus
restaurants_collection = db['restaurants']
menus_collection = db['menus']
analytics_collection = db['analytics']

# Helper function to serialize ObjectId
def serialize_doc(doc):
    if doc:
        doc['_id'] = str(doc['_id'])
        if 'createdAt' in doc:
            doc['createdAt'] = doc['createdAt'].isoformat()
        if 'updatedAt' in doc:
            doc['updatedAt'] = doc['updatedAt'].isoformat()
    return doc

def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Python replica server running', port: 5000})

# ===== RESTAURANT ROUTES =====
@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    try:
        restaurants = list(restaurants_collection.find())
        return jsonify(serialize_docs(restaurants))
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/restaurants', methods=['POST'])
def create_restaurant():
    try:
        data = request.json
        restaurant_data = {
            'name': data.get('name'),
            'address': data.get('address'),
            'rating': float(data.get('rating')),
            'type': data.get('type'),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        result = restaurants_collection.insert_one(restaurant_data)
        restaurant_data['_id'] = str(result.inserted_id)
        
        # Log analytics
        analytics_collection.insert_one({
            'event': 'restaurant_created',
            'restaurantId': str(result.inserted_id),
            'restaurantName': data.get('name'),
            'timestamp': datetime.utcnow()
        })
        
        return jsonify(serialize_doc(restaurant_data)), 201
        
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/restaurants/<restaurant_id>', methods=['PUT'])
def update_restaurant(restaurant_id):
    try:
        data = request.json
        update_data = {
            'name': data.get('name'),
            'address': data.get('address'),
            'rating': float(data.get('rating')),
            'type': data.get('type'),
            'updatedAt': datetime.utcnow()
        }
        
        result = restaurants_collection.find_one_and_update(
            {'_id': ObjectId(restaurant_id)},
            {'$set': update_data},
            return_document=True
        )
        
        return jsonify(serialize_doc(result))
        
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/restaurants/<restaurant_id>', methods=['DELETE'])
def delete_restaurant(restaurant_id):
    try:
        restaurants_collection.delete_one({'_id': ObjectId(restaurant_id)})
        return jsonify({'message': 'Restaurant deleted'})
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

# ===== MENU ROUTES =====
@app.route('/api/menus/<restaurant_id>', methods=['GET'])
def get_menus(restaurant_id):
    try:
        menus = list(menus_collection.find({'restaurantId': restaurant_id}))
        return jsonify(serialize_docs(menus))
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/menus', methods=['POST'])
def create_menu():
    try:
        data = request.json
        menu_data = {
            'name': data.get('name'),
            'price': float(data.get('price')),
            'category': data.get('category'),
            'restaurantId': data.get('restaurantId'),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        result = menus_collection.insert_one(menu_data)
        menu_data['_id'] = str(result.inserted_id)
        
        return jsonify(serialize_doc(menu_data)), 201
        
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/menus/<menu_id>', methods=['PUT'])
def update_menu(menu_id):
    try:
        data = request.json
        update_data = {
            'name': data.get('name'),
            'price': float(data.get('price')),
            'category': data.get('category'),
            'updatedAt': datetime.utcnow()
        }
        
        result = menus_collection.find_one_and_update(
            {'_id': ObjectId(menu_id)},
            {'$set': update_data},
            return_document=True
        )
        
        return jsonify(serialize_doc(result))
        
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

@app.route('/api/menus/<menu_id>', methods=['DELETE'])
def delete_menu(menu_id):
    try:
        menus_collection.delete_one({'_id': ObjectId(menu_id)})
        return jsonify({'message': 'Menu item deleted'})
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

# ===== NOTIFICATION ROUTES =====
@app.route('/api/restaurant-created', methods=['POST'])
def restaurant_created_notification():
    try:
        data = request.json
        analytics_collection.insert_one({
            'event': 'restaurant_created_notification',
            'restaurantId': data.get('restaurantId'),
            'restaurantName': data.get('name'),
            'timestamp': datetime.utcnow(),
            'source': 'nodejs_backend'
        })
        return jsonify({'message': 'Notification received'}), 200
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Python replica server on port {port}...")
    app.run(debug=False, host='0.0.0.0', port=port)