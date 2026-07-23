import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ThemeSwitchControllerService {
  readonly currentTheme = signal("Dark");
  toggleTheme() {
    // TODO: adapt from QML — QML-specific symbols
    // if(this.currentTheme.value==="Dark"){this.currentTheme.set("Light");switchTheme(santanderLight)}else{this.currentTheme.set("Dark");switchTheme(santanderDark)}
  }
  inspect(label="manual") {
    // TODO: adapt from QML — QML-specific symbols
    // const app=globalThis.__mochaNative;if(!app){console.log(`[INSPECT ${label}] no __mochaNative`);return}try{const rootId=app.getRootObject();const rootProps=app.getQmlProperties(rootId);const rootColorProp=rootProps.find(p=>p.name==="color");console.log(`[INSPECT ${label}] rootId=${rootId} color=${rootColorProp?.value}`);const allRoots=app.listRootObjects();console.log(`[INSPECT ${label}] allRoots=${allRoots.length}`);const seen=new Set;const walk=__name2((id,depth)=>{if(seen.has(id)||depth>6)return;seen.add(id);const props=app.getQmlProperties(id);const cp=props.find(p=>p.name==="color");if(cp&&cp.value&&String(cp.value).startsWith("#")){console.log(`  ${" ".repeat(depth*2)}id=${id} color=${cp.value}`)}const kids=app.listChildren(id);for(const k of kids)walk(k.id,depth+1)},"walk");for(const r of allRoots)walk(r.id,0)}catch(e){console.log(`[INSPECT ${label}] failed:`,e.message)}
  }
  logQmlState(label: any) {
    console.log(`[QML ${label}] (see Component.onCompleted hooks)`)
  }
  startAutoToggle() {
    // TODO: adapt from QML — references: inspect, toggleTheme, inspect
    // if(process.env.MOCHA_NO_AUTO_TOGGLE)return;setTimeout(()=>this.inspect("initial"),500);setInterval(()=>{this.toggleTheme();setTimeout(()=>this.inspect("after-toggle"),200)},1500)
  }
}