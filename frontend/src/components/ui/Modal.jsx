import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "./Spinner";

const Modal = ({ isOpen, onClose, loading, children, maxWidth = "max-w-md" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            onClick={onClose}
          >
            <motion.div
              layout
              transition={{
                layout: { duration: 0.35, ease: "easeInOut" },
              }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full h-auto overflow-y-auto overflow-x-hidden custom-scrollbar max-h-[93vh] ${maxWidth} relative border border-violet-500/30 bg-[#0d1117]/80 text-white p-8 rounded-[2rem] shadow-2xl backdrop-blur-2xl`}
            >
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <img src="/purple_bg.webp" alt="" className="w-full h-full object-cover object-right" />
              </div>

             

              <AnimatePresence>
                {loading && (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-[2rem]"
                  >
                    <Spinner />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Modal Content */}
              <div className="relative z-10">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
