import { ShieldAlert, BookOpen, ShieldCheck } from "lucide-react";

export default function CompanyInfo() {
  return (
    <div className="bg-luxury-dark/45 border border-luxury-border/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
      {/* Background radial gradient decoration */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-luxury-gold/2 blur-[80px] rounded-full pointer-events-none select-none" />
      
      <div className="space-y-8 text-center md:text-left">
        <div className="space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold block">Regulatory Compliance</span>
          <h3 className="font-serif text-2xl sm:text-3xl text-white">Company Information</h3>
        </div>

        <div className="w-12 h-[1px] bg-luxury-gold/30 mx-auto md:mx-0" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card item 1 */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <div className="w-8 h-8 rounded-lg bg-luxury-gold/5 flex items-center justify-center text-luxury-gold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold block">Registered Trade Name</span>
              <p className="text-sm text-gray-200 font-light font-serif">Luxe Space Properties L.L.C.</p>
            </div>
          </div>

          {/* Card item 2 */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <div className="w-8 h-8 rounded-lg bg-luxury-gold/5 flex items-center justify-center text-luxury-gold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold block">DED License Number</span>
              <p className="text-sm text-gray-200 font-light font-mono">1602651</p>
            </div>
          </div>

          {/* Card item 3 */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <div className="w-8 h-8 rounded-lg bg-luxury-gold/5 flex items-center justify-center text-luxury-gold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] uppercase tracking-wider text-gray-500 font-bold block">RERA Registration (ORN)</span>
              <p className="text-sm text-gray-200 font-light font-mono">60798</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
