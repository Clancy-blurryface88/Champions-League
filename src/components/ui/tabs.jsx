import * as React from "react"
// React hooks (useState, useEffect, useRef) are used via React.useState etc.
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, children, ...props }, ref) => {
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0, opacity: 0 });
  const listRef = React.useRef(null);

  React.useEffect(() => {
    const updateIndicator = () => {
      if (!listRef.current) return;
      const activeTab = listRef.current.querySelector('[data-state="active"]');
      if (activeTab) {
        setIndicatorStyle({
          left: activeTab.offsetLeft,
          width: activeTab.offsetWidth,
          opacity: 1
        });
      }
    };

    const timeoutId = setTimeout(updateIndicator, 0);
    const observer = new MutationObserver(updateIndicator);
    
    if (listRef.current) {
      observer.observe(listRef.current, { attributes: true, subtree: true, attributeFilter: ['data-state'] });
    }
    
    window.addEventListener('resize', updateIndicator);
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, []);

  return (
    <TabsPrimitive.List
      ref={(node) => {
        listRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn(
        "relative inline-flex h-12 items-center justify-center rounded-full bg-slate-800/80 p-1 text-slate-400 border border-slate-700 shadow-inner",
        className
      )}
      {...props}
    >
      <div 
        className="absolute top-1 bottom-1 rounded-full bg-slate-600 shadow-md transition-all duration-300 ease-out"
        style={indicatorStyle}
      />
      {children}
    </TabsPrimitive.List>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-white hover:text-slate-200",
      className
    )}
    {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 duration-500 ease-out",
      className
    )}
    {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }