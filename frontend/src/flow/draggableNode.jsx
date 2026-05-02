export const DraggableNode = ({ type, label, icon: Icon, color = 'primary', onClick }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType }
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const colorMap = {
    primary: 'bg-primary/10 border-primary/30 text-primary shadow-neon-primary',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20',
    rose: 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20',
    violet: 'bg-violet-500/10 border-violet-500/30 text-violet-400 shadow-neon-violet hover:bg-violet-500/20',
    sky: 'bg-sky-400/10 border-sky-400/30 text-sky-400 hover:bg-sky-400/20',
    amber: 'bg-amber-400/10 border-amber-400/30 text-amber-400 hover:bg-amber-400/20',
    indigo: 'bg-indigo-400/10 border-indigo-400/30 text-indigo-400 hover:bg-indigo-400/20',
    cyan: 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20',
    orange: 'bg-orange-400/10 border-orange-400/30 text-orange-400 hover:bg-orange-400/20',
    fuchsia: 'bg-fuchsia-400/10 border-fuchsia-400/30 text-fuchsia-400 hover:bg-fuchsia-400/20',
  };

  const colorClass = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`cursor-grab flex flex-col items-center justify-center min-w-[80px] h-24 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-95 group ${colorClass}`}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      onClick={() => onClick && onClick(type)}
      draggable
    >
      <div className="mb-2 group-hover:scale-110 transition-transform duration-300">
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <span className="text-[14px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
};