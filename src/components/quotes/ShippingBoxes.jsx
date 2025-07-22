import { box } from "../../constants";
import { FaPlus } from "react-icons/fa";

const ShippingBoxes = ({ getQuantity, updateQuantity, setShowAddBoxForm }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Shipping Boxes</h3>
      <div className="space-y-4">
        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 ">
              <img
                src={box}
                alt="Small Box"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Large Boxes</h4>
              <p className="text-gray-600 text-sm mb-4">
                Our chemically hardened, double-walled cardboard box is best for
                bulky items like bedding and blankets.
              </p>
              <p className="text-gray-600 text-xs">
                61cm x 41 x 51 / 24inches x 16 x 20(HWD) 30kg max
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("origin-large-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("origin-large-box")}
                </span>
                <button
                  onClick={() => updateQuantity("origin-large-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src={box}
                alt="Small Box"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Standard Box</h4>
              <p className="text-gray-600 text-sm mb-4">
                Our chemically hardened, double-walled cardboard box is best for
                bulky items like bedding and blankets.
              </p>
              <p className="text-gray-600 text-xs">
                61cm x 41 x 51 / 24inches x 16 x 20(HWD) 30kg max
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("origin-standard-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("origin-standard-box")}
                </span>
                <button
                  onClick={() => updateQuantity("origin-standard-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src={box}
                alt="Small Box"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Clothes Box</h4>
              <p className="text-gray-600 text-sm mb-4">
                Our chemically hardened, double-walled cardboard box is best for
                bulky items like bedding and blankets.
              </p>
              <p className="text-gray-600 text-xs">
                61cm x 41 x 51 / 24inches x 16 x 20(HWD) 30kg max
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("origin-clothes-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("origin-clothes-box")}
                </span>
                <button
                  onClick={() => updateQuantity("origin-clothes-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src={box}
                alt="Small Box"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Book Box</h4>
              <p className="text-gray-600 text-sm mb-4">
                Our chemically hardened, double-walled cardboard box is best for
                bulky items like bedding and blankets.
              </p>
              <p className="text-gray-600 text-xs">
                61cm x 41 x 51 / 24inches x 16 x 20(HWD) 30kg max
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => updateQuantity("origin-book-box", -1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">
                  {getQuantity("origin-book-box")}
                </span>
                <button
                  onClick={() => updateQuantity("origin-book-box", 1)}
                  className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <img
                src={box}
                alt="Small Box"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-2">Add your own box</h4>
              <p className="text-gray-600 text-sm mb-4">
                Already have some sturdy boxes you can use? Add them here.
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setShowAddBoxForm(true)}
                  className="px-4 py-2 bg-primary text-white cursor-pointer flex items-center gap-2 rounded-full"
                >
                  <FaPlus /> Add Box
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingBoxes;
