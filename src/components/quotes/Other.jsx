import { FaPlus } from "react-icons/fa"
const OTHER = [
  {
    title: "Massage Table",
    dimensions: "65cm x 76 x 182 / 25inches x 30 x 71(HWD)"
  },
  {
    title: "Massage Table (Dismantled)",
    dimensions: "10cm x 76 x 182 / 4inches x 30 x 71(HWD)"
  },
  {
    title: "Rocking Horse",
    dimensions: "95cm x 45 x 137 / 37inches x 18 x 53(HWD)"
  },
  {
    title: "Standard Lamp",
    dimensions: "152cm x 35 x 30 / 59inches x 14 x 12(HWD)"
  },
  {
    title: "Three Storey Dolls House",
    dimensions: "120cm x 91 x 30 / 47inches x 35 x 12(HWD) 30kg max"
  }
]

const Other = ({ getQuantity, updateQuantity, setShowAddBoxForm }) => {
  return (
   <div>
         <h3 className="text-xl font-semibold mb-4">Dining Room</h3>
         <div className="space-y-4">
           {OTHER.map((item, index) => (
             <div
               key={index}
               className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
             >
               <div className="flex items-center gap-6">
                 <div className="flex-1">
                   <h4 className="font-semibold mb-2">{item.title}</h4>
                   <p className="text-gray-600 text-sm mb-4">{item.dimensions}</p>
                 </div>
                 <div className="flex items-center">
                   <div className="flex items-center border rounded-lg">
                     <button
                       onClick={() => updateQuantity("other-large-box", -1)}
                       className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                     >
                       -
                     </button>
                     <span className="px-4 py-1 border-x">
                       {getQuantity("other-large-box")}
                     </span>
                     <button
                       onClick={() => updateQuantity("other-large-box", 1)}
                       className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                     >
                       +
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           ))}
   
           <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
             <div className="flex items-center gap-6">
               <div className="flex-1">
                 <h4 className="font-semibold mb-2">Add Custom Item</h4>
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
  )
}

export default Other