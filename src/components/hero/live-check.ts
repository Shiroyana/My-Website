/**
 * Runs inline before the hero paints. On a screen that will play the live build, it marks <html> with
 * data-hero-live so the finished still stays hidden (brand.css) and the visitor sees the house build
 * from its foundations, not the finished house and then the build. Only the cheap checks run here;
 * HeroVisual repeats them with the WebGL test and removes the mark if the live build cannot run.
 */
export const HERO_LIVE_CHECK = `(function(){try{var n=navigator;if(/[?&]still(=|&|$)/.test(location.search))return;if(!matchMedia('(min-width: 1024px)').matches)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if((n.hardwareConcurrency||8)<=4)return;if(n.deviceMemory!=null&&n.deviceMemory<4)return;if(n.connection&&n.connection.saveData)return;document.documentElement.setAttribute('data-hero-live','')}catch(e){}})()`;

export const LIVE_ATTR = "data-hero-live";
