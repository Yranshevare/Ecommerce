// Mock orders data - TODO: Replace with API fetch from your backend
// Example: const orders = await fetch('/api/orders').then(res => res.json());

export interface OrderItem {
  productId: string;
  price:{key:string, value:string, discount?:number},
  quantity: number;
  productData:{
    images:string[],
    specification:{[key:string]:string},
    name:string
  }
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' ;
  products: OrderItem[];
  subtotal: number;
  shipping: number;
  totalPrice: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  createdAt: string;
  updatedAt: string;
}

// export const mockOrders: Order[] = [
//   {
//     id: '1',
//     orderNumber: 'ORD-2024-001',
//     date: '2024-01-15',
//     status: 'ACCEPTED',
//     products: [
//       {
//         productId: 'p1',
//         price: '89.99',
//         quantity: 1,
//         productData: {
//           images: ['/src/assets/product-1.jpg'],
//           specification: {
//             size: 'King',
//             color: 'Ivory White',
//             material: 'Cotton',
//           },
//         },
//       },
//       {
//         productId: 'p2',
//         price: '24.99',
//         quantity: 2,
//         productData: {
//           images: ['/src/assets/product-3.jpg'],
//           specification: {
//             color: 'Forest Green',
//             material: 'Velvet',
//           },
//         },
//       },
//     ],
//     subtotal: 139.97,
//     shipping: 0,
//     totalPrice: 139.97,
//     shippingAddress: {
//       name: 'John Doe',
//       street: '123 Main Street',
//       city: 'New York',
//       state: 'NY',
//       zip: '10001',
//     },
//   },
//   {
//     id: '2',
//     orderNumber: 'ORD-2024-002',
//     date: '2024-01-20',
//     status: 'PENDING',
//     products: [
//       {
//         productId: 'p3',
//         price: '149.99',
//         quantity: 1,
//         productData: {
//           images: ['/src/assets/product-5.jpg'],
//           specification: {
//             size: '3-Seater',
//             color: 'Natural Beige',
//             material: 'Linen',
//           },
//         },
//       },
//     ],
//     subtotal: 149.99,
//     shipping: 9.99,
//     totalPrice: 159.98,
//     shippingAddress: {
//       name: 'John Doe',
//       street: '123 Main Street',
//       city: 'New York',
//       state: 'NY',
//       zip: '10001',
//     },
//   },
//   {
//     id: '3',
//     orderNumber: 'ORD-2024-003',
//     date: '2024-01-22',
//     status: 'REJECTED',
//     products: [
//       {
//         productId: 'p4',
//         price: '34.99',
//         quantity: 4,
//         productData: {
//           images: ['/src/assets/product-2.jpg'],
//           specification: {
//             color: 'Blush Pink',
//             material: 'Silk',
//           },
//         },
//       },
//     ],
//     subtotal: 139.96,
//     shipping: 0,
//     totalPrice: 139.96,
//     shippingAddress: {
//       name: 'John Doe',
//       street: '123 Main Street',
//       city: 'New York',
//       state: 'NY',
//       zip: '10001',
//     },
//   },
// ];

