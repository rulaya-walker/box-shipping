import { FaPlus } from "react-icons/fa"
import { backpacks } from "../../constants"
const Backpacks = ({ getQuantity, updateQuantity, setShowAddBoxForm }) => {
  return (
    <div>
          <h3 className="text-xl font-semibold mb-4">Shipping Boxes</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img
                    src={backpacks}
                    alt="Small Box"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Add a backpacks</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Please add the dimensions of your backpacks here.
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center">
                    <button
                      onClick={() => setShowAddBoxForm(true)}
                      className="px-4 py-2 bg-primary text-white cursor-pointer flex items-center gap-2 rounded-full"
                    >
                      <FaPlus /> Add a backpack
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default Backpacks