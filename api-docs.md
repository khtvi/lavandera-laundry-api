# Laundry API — Route Documentation

Base URL: `http://localhost:3000`

## GET /orders
List every current order.

**Body:** none

**Example response:**
```json
[
  { "id": 1, "customerName": "Maria Santos", "loadCount": 2, "status": "Pending", "dropOffTime": "8:00 AM" }
]
```

## POST /orders
Create a new order.

**Body:**
```json
{ "customerName": "Liza Gomez", "loadCount": 2, "dropOffTime": "10:30 AM" }
```

**Example response:**
```json
{ "id": 4, "customerName": "Liza Gomez", "loadCount": 2, "status": "Pending", "dropOffTime": "10:30 AM" }
```

## PUT /orders/:id
Update an existing order's status.

**Body:**
```json
{ "status": "Ready for Pickup" }
```

**Example response:**
```json
{ "id": 2, "customerName": "Pedro Reyes", "loadCount": 1, "status": "Ready for Pickup", "dropOffTime": "9:15 AM" }
```

## DELETE /orders/:id
Cancel (remove) an order.

**Body:** none

**Example response:**
```json
{ "message": "Order cancelled", "cancelledOrder": { "id": 1, "customerName": "Maria Santos", "loadCount": 2, "status": "Pending", "dropOffTime": "8:00 AM" } }
```
