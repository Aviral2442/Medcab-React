// import { useEffect } from "react";

// export function useZoom(percent = 90) {
//   useEffect(() => {
//     const scale = percent / 100;
//     const root = document.documentElement;
    
//     // Apply transform scale (works in all browsers)
//     root.style.transform = `scale(${scale})`;
//     root.style.transformOrigin = "top left";
//     root.style.width = `${100 / scale}%`;
//     root.style.height = `${100 / scale}%`;
    
//     return () => {
//       root.style.transform = "";
//       root.style.transformOrigin = "";
//       root.style.width = "";
//       root.style.height = "";
//     };
//   }, [percent]);
// }