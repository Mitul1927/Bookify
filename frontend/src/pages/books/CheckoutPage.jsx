import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { useAuth } from "../../context/AuthContext";
import { useCreateOrderMutation, useGetOrdersByEmailQuery } from "../../redux/features/orders/ordersApi";
import Swal from "sweetalert2";

const CheckoutPage = () => {
  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  // const [ refetch] = useGetOrdersByEmailQuery(currentUser?.email);
  const onSubmit = async (data) => {
    console.log(data);
    const newOrder = {
      name: data.name,
      email: currentUser?.email,
      address: {
        city: data.city,
        country: data.country,
        zipcode: data.zipcode,
        state: data.state,
        street: data.street,
      },
      phone: data.phone,
      productIds: cartItems.map((item) => item?._id),
      totalPrice: totalPrice
    };
    try {
      await createOrder(newOrder).unwrap();
      Swal.fire({
        title: "Confirmed Order",
        text: "Your order placed successfully!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, It's Okay!",
      });
      dispatch(clearCart());
      // refetch();
    } catch (err) {
      console.log("Error in placing an order", err);
      alert("Failed to add order");
    }
    navigate("/order");
  };
  // if (isLoading) return <div>Loading...</div>;
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.newPrice, 0)
    .toFixed(2);
  // TODO : get user from authorized
  const [isChecked, setIsChecked] = useState(false);
  return (
    <>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div>
              <h2 className="font-semibold text-xl text-gray-600 mb-2">
                Cash On Delivery
              </h2>
              <p className="text-gray-500 mb-2">Total Price: ${totalPrice}</p>
              <p className="text-gray-500 mb-6">Items: {cartItems.length}</p>
            </div>

            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              {cartItems.length > 0 ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8"
                >
                  <div className="text-gray-600">
                    <p className="font-medium text-lg">Personal Details</p>
                    <p>Please fill out all the fields.</p>
                  </div>

                  <div className="lg:col-span-2">
                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-5">
                        <label htmlFor="full_name">Full Name</label>
                        <input
                          {...register("name", { required: true })}
                          type="text"
                          name="name"
                          id="name"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                        />
                      </div>

                      <div className="md:col-span-5">
                        <label html="email">Email Address</label>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          disabled
                          defaultValue={currentUser?.email}
                          placeholder="email@domain.com"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <label html="phone">Phone Number</label>
                        <input
                          {...register("phone", { required: true })}
                          type="number"
                          name="phone"
                          id="phone"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder="+123 456 7890"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label htmlFor="street">Address / Street</label>
                        <input
                          {...register("street", { required: true })}
                          type="text"
                          name="street"
                          id="street"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder="Address"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="city">City</label>
                        <input
                          {...register("city", { required: true })}
                          type="text"
                          name="city"
                          id="city"
                          className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder="City"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="country">Country / region</label>
                        <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                          <input
                            {...register("country", { required: true })}
                            name="country"
                            id="country"
                            type="text"
                            placeholder="Country"
                            className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="state">State / province</label>
                        <div className="h-10 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                          <input
                            {...register("state", { required: true })}
                            name="state"
                            id="state"
                            type="text"
                            placeholder="State"
                            className="px-4 appearance-none outline-none text-gray-800 w-full bg-transparent"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-1">
                        <label htmlFor="zipcode">Zipcode</label>
                        <input
                          {...register("zipcode", { required: true })}
                          type="text"
                          name="zipcode"
                          id="zipcode"
                          className="transition-all flex items-center h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                          placeholder=""
                        />
                      </div>

                      <div className="md:col-span-5 mt-3">
                        <div className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="billing_same"
                            id="billing_same"
                            className="form-checkbox"
                            onClick={() => setIsChecked(!isChecked)}
                          />
                          <label htmlFor="billing_same" className="ml-2 ">
                            I am aggree to the{" "}
                            <Link className="underline underline-offset-2 text-blue-600">
                              Terms & Conditions
                            </Link>{" "}
                            and{" "}
                            <Link className="underline underline-offset-2 text-blue-600">
                              Shoping Policy.
                            </Link>
                          </label>
                        </div>
                      </div>

                      <div className="md:col-span-5 text-right">
                        <div className="inline-flex items-end">
                          <button
                            disabled={!isChecked}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Place an Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <p>No items in Checkout</p>
              )}
               {isLoading && <div>Loading...</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
