// const createOrderByUserId2 = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     await transactionContext(async (transactionMangaer) => {
//       const userRepository = transactionMangaer.getRepository(User);
//       const productRepository = transactionMangaer.getRepository(Product);

//       let { orderProducts } = req.body;

//       orderProducts = Object.values(
//         orderProducts.reduce((acc, curr) => {
//           if (acc[curr.productId]) {
//             acc[curr.productId].quantity += curr.quantity;
//           } else {
//             acc[curr.productId] = { ...curr };
//           }
//           return acc;
//         }, {} as Record<number, (typeof orderProducts)[0]>)
//       );

//       const userId = Number(req.params.userId);

//       const foundUser = await userRepository.findOne({
//         where: { id: userId },
//         relations: ["orders", "orders.orderProducts"],
//       });

//       if (!foundUser) {
//         return res.status(404).json({ message: `User(${userId}) not found` });
//       }

//       if (!orderProducts || !orderProducts.length) {
//         return res.status(400).json({ message: `No products added to order` });
//       }

//       const newOrder = new Order();
//       newOrder.orderProducts = [] as OrderProducts[];
//       const productsToSave = [] as Product[];

//       for (const orderProduct of orderProducts) {
//         const foundProduct = await productRepository.findOneBy({
//           id: orderProduct.productId,
//         });

//         if (!foundProduct) {
//           throw new Error(`Product (${orderProduct.productId}) not found`);
//         }

//         if (foundProduct.stock < orderProduct.quantity) {
//           throw new Error(
//             `Not enough stock for product (${orderProduct.productId})`
//           );
//         }

//         foundProduct.stock -= orderProduct.quantity;

//         const op = new OrderProducts();
//         op.productId = orderProduct.productId;
//         op.quantity = orderProduct.quantity;
//         op.price = foundProduct.price * orderProduct.quantity;

//         newOrder.orderProducts.push(op);
//         productsToSave.push(foundProduct);
//       }
//       await productRepository.save(productsToSave);

//       foundUser.orders.push(newOrder);

//       const result = await userRepository.save(foundUser);

//       res.status(201).json(result);
//     });
//   } catch (error) {
//     next(error);
//   }
// };
