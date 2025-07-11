import { FaPlus } from "react-icons/fa"
const MUSICAL = [
  {
    title: "Acoustic Guitar",
    dimensions: "18cm x 46 x 106 / 7inches x 18 x 41(HWD)"
  },
  {
    title: "Acoustic Guitar With Hardcase",
    dimensions: "22cm x 51 x 118 / 9inches x 20 x 46(HWD)"
  },
  {
    title: "Electric Guitar",
    dimensions: "18cm x 46 x 106 / 7inches x 18 x 41(HWD)"
  },
  {
    title: "Electric Guitar With Hardcase",
    dimensions: "22cm x 51 x 118 / 9inches x 20 x 46(HWD)"
  },
  {
    title: "Upright Piano",
    dimensions: "120cm x 155 x 60 / 47inches x 60 x 23(HWD)"
  },
  {
    title: "Electronic Keyboard",
    dimensions: "10cm x 93 x 25 / 4inches x 36 x 10(HWD)"
  }
]

const Musica = ({ getQuantity, updateQuantity, setShowAddBoxForm }) => {
  return (
       <div>
         <h3 className="text-xl font-semibold mb-4">Dining Room</h3>
         <div className="space-y-4">
           {MUSICAL.map((item, index) => (
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
                       onClick={() => updateQuantity("large-box", -1)}
                       className="px-3 py-1 text-gray-600 cursor-pointer hover:bg-gray-100"
                     >
                       -
                     </button>
                     <span className="px-4 py-1 border-x">
                       {getQuantity("large-box")}
                     </span>
                     <button
                       onClick={() => updateQuantity("large-box", 1)}
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

export default Musica