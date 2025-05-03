from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import json
from datetime import datetime
from twilio.rest import Client
 

app = Flask(__name__)
CORS(app)

# MySQL DB config
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="123456",
    database="pixelplates"
)
cursor = db.cursor()


# ✅ Twilio Config
account_sid = 'AC6a566adda0fba8004ba72271976f61a6'
auth_token = '33a647455c78ef061f7936a6b4c50dde'
twilio_number = '+19714022819'

client = Client(account_sid, auth_token)


@app.route('/submit-order', methods=['POST'])
def submit_order():
    data = request.json
    name = data['name']
    phone = data['phone']
    seat = data['seat']
    items_ordered = data['items']
    total = data['amount']
    status = data['payment_status']
    time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    query = "INSERT INTO orders (customer_name, phone_number, seat_number, items_ordered, total_amount, payment_status, order_time) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(query, (name, phone, seat, items_ordered, total, status, time))
    db.commit()

    # ✅ Send SMS
    message_body = f"Hi {name}, thank you for your order at Pixel Plates! 🍽️\nItems: {items_ordered}\nTotal: ₹{total}\nSeat: {seat}"
    try:
        client.messages.create(
            body=message_body,
            from_=twilio_number,
            to=f'+91{phone}'
        )
    except Exception as e:
        print("Error sending SMS:", e)

    return jsonify({'message': 'Order stored successfully!'})



if __name__ == '__main__':
    app.run(debug=True)
