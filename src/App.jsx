import Commerce from "@chec/commerce.js";
import { useEffect, useState } from "react";
import clsx from "clsx";

const commerce = new Commerce(
  "pk_test_33604fabfcb5bb43bb5210cf8d2b7bfdb8fd7f8be511d"
);

function App() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    commerce.products.list().then((res) => setProducts(res.data));
    updateCartTotal();
    loadContents();
    // eslint-disable-next-line
  }, []);

  const addToCart = async (id) => {
    setLoading(true);
    await commerce.cart.add(id);
    updateCartTotal().then(() => setLoading(false));
  };

  const removeFromCart = async (id) => {
    setLoading(true);
    await commerce.cart.delete(id);
    updateCartTotal().then(() => setLoading(false));
  };

  const loadContents = async () => {
    const contents = await commerce.cart.contents();
    setContents(contents);
  };

  const getCartTotal = async () => {
    const contents = await commerce.cart.contents();
    return contents.reduce((acc, cur) => acc + cur.price.raw, 0);
  };

  const updateCartTotal = async () => {
    const total = await getCartTotal();
    loadContents();
    setTotal(total);
  };

  const clearCart = async () => {
    setLoading(true);
    await commerce.cart.empty();
    updateCartTotal().then(() => setLoading(false));
  };

  return (
    <div className="h-screen flex flex-col items-center p-10 gap-10">
      <h1 className="font-extrabold text-4xl">Nike products ✔</h1>
      <div className="flex-1"></div>
      <div className="flex bg-green-300 rounded p-10 gap-10">
        {products.map(({ id, name, media, price }) => {
          const isInCart = contents.find(({ product_id: prodId }) => {
            return id === prodId;
          });
          return (
            <div
              key={id}
              className="shadow bg-white p-10 rounded flex flex-col items-center gap-4"
            >
              <h1 className="font-bold text-xl">{name}</h1>
              <img src={media.source} alt="product" className="w-80" />
              <p>Price: {price.formatted_with_symbol}</p>
              <div className="flex gap-2">
                <button
                  disabled={loading}
                  onClick={() =>
                    !isInCart ? addToCart(id) : removeFromCart(id)
                  }
                  className={clsx(
                    " py-2 px-4 rounded border-2",
                    loading && "bg-gray-300 text-black border-gray-50",
                    !loading &&
                      !isInCart &&
                      "bg-green-600 text-white  border-green-600",
                    !loading && isInCart && "border-green-800 text-green-900"
                  )}
                >
                  {isInCart ? "Remove From Cart" : "Add To Cart"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-10 shadow bg-green-300 w-80 h-16 px-12 py-3 rounded items-center justify-between">
        {loading ? (
          <p className="text-xl font-semibold">Loading</p>
        ) : (
          <>
            <p className="text-xl font-semibold">TOTAL: {total}</p>
            <button
              onClick={clearCart}
              className="border-2 bg-green-200 border-white rounded p-1 px-3 text-black font-bold"
            >
              CLEAR
            </button>
          </>
        )}
      </div>
      <div className="flex-1"></div>
    </div>
  );
}

export default App;
