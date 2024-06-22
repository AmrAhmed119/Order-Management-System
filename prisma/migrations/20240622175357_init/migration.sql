-- CreateEnum
CREATE TYPE "orderstatus" AS ENUM ('Pending', 'Cancelled', 'Refunded', 'Completed');

-- CreateTable
CREATE TABLE "Carts" (
    "cartId" SERIAL NOT NULL,
    "userId" SERIAL NOT NULL,

    CONSTRAINT "Carts_pkey" PRIMARY KEY ("cartId")
);

-- CreateTable
CREATE TABLE "Carts_Products" (
    "Carts_cartId" SERIAL NOT NULL,
    "Products_productId" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Carts_Products_pkey" PRIMARY KEY ("Carts_cartId","Products_productId")
);

-- CreateTable
CREATE TABLE "Coupons" (
    "code" VARCHAR(20) NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "validFrom" DATE NOT NULL,
    "validTo" DATE NOT NULL,

    CONSTRAINT "Coupons_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Orders" (
    "orderId" SERIAL NOT NULL,
    "orderDate" TIMESTAMPTZ(6) NOT NULL,
    "status" "orderstatus" NOT NULL,
    "userId" SERIAL NOT NULL,
    "couponCode" VARCHAR(20),

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "Orders_Products" (
    "Orders_orderId" SERIAL NOT NULL,
    "Products_productId" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Orders_Products_pkey" PRIMARY KEY ("Orders_orderId","Products_productId")
);

-- CreateTable
CREATE TABLE "Products" (
    "productId" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Users" (
    "userId" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "userId" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Carts_Products" ADD CONSTRAINT "Carts_Products_Carts_cartId_fkey" FOREIGN KEY ("Carts_cartId") REFERENCES "Carts"("cartId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Carts_Products" ADD CONSTRAINT "Carts_Products_Products_productId_fkey" FOREIGN KEY ("Products_productId") REFERENCES "Products"("productId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "couponCode" FOREIGN KEY ("couponCode") REFERENCES "Coupons"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "userId" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Orders_Products" ADD CONSTRAINT "Orders_Products_Orders_orderId_fkey" FOREIGN KEY ("Orders_orderId") REFERENCES "Orders"("orderId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Orders_Products" ADD CONSTRAINT "Orders_Products_Products_productId_fkey" FOREIGN KEY ("Products_productId") REFERENCES "Products"("productId") ON DELETE NO ACTION ON UPDATE NO ACTION;
