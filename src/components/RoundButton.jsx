
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoundButton({ round, onClick, isPredicted, isExpired }) {
  const getStatusIcon = () => {
    if (isPredicted) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (isExpired) return <Lock className="w-5 h-5 text-red-500" />;
    return <Calendar className="w-5 h-5 text-sky-400" />;
  };

  const getStatusColor = () => {
    if (isPredicted) return "from-teal-800/40 to-teal-900/40 border-teal-600/50";
    if (isExpired) return "from-slate-700/50 to-slate-800/50 border-slate-600/50";
    return "from-sky-800/40 to-indigo-900/40 border-sky-600/50";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`
        bg-gradient-to-r ${getStatusColor()}
        border-2 hover:shadow-lg hover:border-slate-400/50 transition-all duration-300
        ${!isExpired ? 'cursor-pointer' : 'opacity-60'}
      `}>
        <CardContent className="p-0">
          <Button
            variant="ghost"
            className="w-full h-full p-6 text-left"
            onClick={onClick}
            disabled={isExpired}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                {getStatusIcon()}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {round.name}
                  </h3>
                  {round.deadline && (
                    <p className="text-sm text-slate-300">
                      Deadline: {new Date(round.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                {isPredicted && (
                  <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                    Predicted
                  </div>
                )}
                {isExpired && (
                  <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                    Expired
                  </div>
                )}
                {!isPredicted && !isExpired && (
                  <div className="bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-sm font-medium">
                    Open
                  </div>
                )}
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
