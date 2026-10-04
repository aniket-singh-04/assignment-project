import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './GlassCard';

export default function DataTable({ columns, data, sortConfig, onSort }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <p className={isDark ? 'text-[#FFFFFF]/70 font-medium' : 'text-[#232323]/80 font-medium'}>No records found.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="w-full max-w-full overflow-x-auto !p-0">
      <table className="min-w-full divide-y divide-[#FFFFFF]/10">
        <thead className={isDark ? 'bg-[#000000]/30' : 'bg-[#232323]/5'}>
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx}
                scope="col" 
                className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-[#FFFFFF]/90' : 'text-[#232323]'
                } ${col.sortKey && onSort ? 'cursor-pointer hover:bg-[#1D5DEC]/10 transition-colors select-none' : ''}`}
                onClick={() => col.sortKey && onSort && onSort(col.sortKey)}
              >
                <div className="flex items-center gap-1.5">
                  {col.header}
                  {col.sortKey && sortConfig && sortConfig.key === col.sortKey && (
                    <span className="text-[#1D5DEC] flex flex-col -space-y-1">
                      <FiChevronUp className={`w-3.5 h-3.5 ${sortConfig.direction === 'asc' ? 'opacity-100' : 'opacity-30'}`} />
                      <FiChevronDown className={`w-3.5 h-3.5 ${sortConfig.direction === 'desc' ? 'opacity-100' : 'opacity-30'}`} />
                    </span>
                  )}
                  {col.sortKey && (!sortConfig || sortConfig.key !== col.sortKey) && (
                    <span className="opacity-30 flex flex-col -space-y-1">
                      <FiChevronUp className="w-3.5 h-3.5" />
                      <FiChevronDown className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${isDark ? 'divide-[#FFFFFF]/10' : 'divide-[#232323]/10'}`}>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-[#1D5DEC]/10 transition-colors">
              {columns.map((col, colIdx) => (
                <td key={colIdx} className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-[#FFFFFF]' : 'text-[#232323]'}`}>
                  {col.accessor(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </GlassCard>
  );
}
