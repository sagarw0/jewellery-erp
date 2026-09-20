import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { AnalyticsSummaryCard } from '../../services/toolResolvers';

interface AiAnalyticsCardsProps {
  cards: AnalyticsSummaryCard[];
}

export const AiAnalyticsCards: React.FC<AiAnalyticsCardsProps> = ({ cards }) => {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 my-3">
      {cards.map((card) => {
        const isEmerald = card.colorScheme === 'emerald';
        const isBlue = card.colorScheme === 'blue';
        const isAmber = card.colorScheme === 'amber';
        const isRose = card.colorScheme === 'rose';

        const borderClass = isEmerald
          ? 'border-emerald-200/80 hover:border-emerald-400 bg-emerald-50/50'
          : isBlue
          ? 'border-sky-200/80 hover:border-sky-400 bg-sky-50/50'
          : isAmber
          ? 'border-amber-200/80 hover:border-amber-400 bg-amber-50/50'
          : isRose
          ? 'border-rose-200/80 hover:border-rose-400 bg-rose-50/50'
          : 'border-purple-200/80 hover:border-purple-400 bg-purple-50/50';

        const textAccent = isEmerald
          ? 'text-emerald-950'
          : isBlue
          ? 'text-sky-950'
          : isAmber
          ? 'text-amber-950'
          : isRose
          ? 'text-rose-950'
          : 'text-purple-950';

        return (
          <div
            key={card.id}
            className={`p-3 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col justify-between ${borderClass}`}
          >
            <div>
              <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                {card.title}
              </span>
              <div className={`text-base sm:text-lg font-bold font-mono tracking-normal my-0.5 ${textAccent}`}>
                {card.value}
              </div>
            </div>

            <div className="pt-1 border-t border-black/5 flex items-center justify-between text-[10px]">
              <span className="text-slate-600 font-medium truncate">{card.subtext}</span>
              {card.trend && (
                <span
                  className={`inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded-full font-bold font-mono text-[9.5px] ${
                    card.trend.direction === 'up'
                      ? 'bg-emerald-100 text-emerald-800'
                      : card.trend.direction === 'down'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {card.trend.direction === 'up' ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : card.trend.direction === 'down' ? (
                    <TrendingDown className="w-2.5 h-2.5" />
                  ) : (
                    <Minus className="w-2.5 h-2.5" />
                  )}
                  <span>{card.trend.percentage}</span>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
