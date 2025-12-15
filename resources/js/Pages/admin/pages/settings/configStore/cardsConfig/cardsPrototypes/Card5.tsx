import { Star } from "lucide-react";

// Card 7: Featured Big
export const Card5: React.FC<any> = ({ product, config, className }) => {
    return (
        <div className={`bg-white h-full flex flex-col rounded-none ${config.showBorder ? 'border border-slate-900' : 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border border-slate-900'} ${className}`}>
             <div className="p-3 border-b border-slate-900 flex justify-between items-center bg-slate-100">
                <span className="text-xs font-black uppercase tracking-widest">New Arrival</span>
                {config.showRating && <div className="flex text-xs font-bold items-center"><Star className="w-3 h-3 fill-black text-black mr-1"/> {product.rating}</div>}
             </div>
             <div className="aspect-[5/4] relative overflow-hidden group border-b border-slate-900">
                 <img src={product.image} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
             </div>
             <div className="p-5 bg-white flex flex-col gap-4">
                 <div>
                    <h3 className="font-black text-xl uppercase tracking-tight">{product.name}</h3>
                    {config.showPrice && <p className="text-lg font-medium text-slate-500 mt-1">${product.price}</p>}
                 </div>
                 <button className="w-full bg-black text-white px-4 py-3 text-sm font-bold uppercase hover:bg-slate-800 transition-colors">Buy Now</button>
             </div>
        </div>
    );
}