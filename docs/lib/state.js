var state=function(t){var n={};function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var i in t)e.d(r,i,function(n){return t[n]}.bind(null,i));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=11)}([function(t,n,e){"use strict";n.__esModule=!0;var r=e(12);n.assert=r.assert;var i=e(13);n.log=i.log;var o=e(14);n.random=o.random;var a=e(15);n.tree=a.tree},function(t,n,e){"use strict";n.__esModule=!0;var r=function(){function t(t,n){this.target=n,this.guard=function(t){return!0},this.actions=[],t.outgoing.unshift(this)}return t.prototype.effect=function(t){return this.actions.unshift(t),this},t.prototype.when=function(t){return this.guard=t,this},t}();n.Transition=r},function(t,n,e){"use strict";n.__esModule=!0;var r=e(5);n.PseudoStateKind=r.PseudoStateKind;var i=e(6);n.State=i.State;var o=e(7);n.Region=o.Region;var a=e(4);n.PseudoState=a.PseudoState;var s=e(1);n.Transition=s.Transition;var u=e(3);n.ExternalTransition=u.ExternalTransition;var c=e(9);n.InternalTransition=c.InternalTransition;var f=e(8);n.LocalTransition=f.LocalTransition},function(t,n,e){"use strict";var r=this&&this.__extends||function(){var t=function(n,e){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])})(n,e)};return function(n,e){function r(){this.constructor=n}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}}();n.__esModule=!0;var i=e(0),o=e(4),a=function(t){function n(n,e){var r=t.call(this,n,e)||this;r.source=n;var a=i.tree.ancestors(n,function(t){return t.parent}),s=i.tree.ancestors(e,function(t){return t.parent}),u=i.tree.lca(a,s)+1,c=s.length-(e instanceof o.PseudoState&&e.isHistory()?1:0);return r.toLeave=a[u],r.toEnter=s.slice(u,c).reverse(),i.log.info(function(){return"Created external transition from "+n+" to "+e},i.log.Create),r}return r(n,t),n}(e(1).Transition);n.ExternalTransition=a},function(t,n,e){"use strict";n.__esModule=!0;var r=e(0),i=e(5),o=e(6),a=e(3),s=function(){function t(t,n,e){void 0===e&&(e=i.PseudoStateKind.Initial);var a=this;this.name=t,this.kind=e,this.outgoing=[],this.parent=n instanceof o.State?n.getDefaultRegion():n,this.qualifiedName=this.parent+"."+this.name,(this.kind===i.PseudoStateKind.Initial||this.isHistory())&&(r.assert.ok(!this.parent.starting,function(){return"Only one initial pseudo state is allowed in region "+a.parent}),this.parent.starting=this),this.parent.children.unshift(this),r.log.info(function(){return"Created "+a},r.log.Create)}return t.prototype.isHistory=function(){return this.kind===i.PseudoStateKind.DeepHistory||this.kind===i.PseudoStateKind.ShallowHistory},t.prototype.external=function(t){return new a.ExternalTransition(this,t)},t.prototype.to=function(t){return this.external(t)},t.prototype.else=function(t){var n=this;return r.assert.ok(!this.elseTransition,function(){return"Only 1 else transition allowed at "+n+"."}),this.elseTransition=new a.ExternalTransition(this,t).when(function(){return!1})},t.prototype.toString=function(){return this.qualifiedName},t}();n.PseudoState=s},function(t,n,e){"use strict";n.__esModule=!0,function(t){t[t.Initial=1]="Initial",t[t.ShallowHistory=2]="ShallowHistory",t[t.DeepHistory=4]="DeepHistory",t[t.Junction=8]="Junction",t[t.Choice=16]="Choice"}(n.PseudoStateKind||(n.PseudoStateKind={}))},function(t,n,e){"use strict";n.__esModule=!0;var r=e(0),i=e(7),o=e(3),a=e(8),s=e(9),u=function(){function t(n,e){void 0===e&&(e=void 0);var i=this;this.name=n,this.outgoing=[],this.children=[],this.onEnter=[],this.onLeave=[],this.parent=e instanceof t?e.getDefaultRegion():e,this.parent?(r.assert.ok(!this.parent.children.filter(function(n){return n instanceof t&&n.name===i.name}).length,function(){return"State names must be unique within a region"}),this.qualifiedName=this.parent+"."+n,this.parent.children.unshift(this)):this.qualifiedName=n,r.log.info(function(){return"Created "+i},r.log.Create)}return t.prototype.getDefaultRegion=function(){return this.defaultRegion||(this.defaultRegion=new i.Region(this.name,this))},t.prototype.isSimple=function(){return 0===this.children.length},t.prototype.isComposite=function(){return this.children.length>=1},t.prototype.isOrthogonal=function(){return this.children.length>=2},t.prototype.entry=function(t){return this.onEnter.unshift(t),this},t.prototype.exit=function(t){return this.onLeave.unshift(t),this},t.prototype.external=function(t){return new o.ExternalTransition(this,t)},t.prototype.to=function(t){return t?this.external(t):this.internal()},t.prototype.internal=function(){return new s.InternalTransition(this)},t.prototype.local=function(t){return new a.LocalTransition(this,t)},t.prototype.toString=function(){return this.qualifiedName},t}();n.State=u},function(t,n,e){"use strict";n.__esModule=!0;var r=e(0),i=function(){function t(t,n){var e=this;this.name=t,this.parent=n,this.children=[],this.qualifiedName=n+"."+t,this.parent.children.unshift(this),r.log.info(function(){return"Created "+e},r.log.Create)}return t.prototype.toString=function(){return this.qualifiedName},t}();n.Region=i},function(t,n,e){"use strict";var r=this&&this.__extends||function(){var t=function(n,e){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])})(n,e)};return function(n,e){function r(){this.constructor=n}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}}();n.__esModule=!0;var i=e(0),o=e(1),a=e(4),s=function(t){function n(n,e){var r=t.call(this,n,e)||this;r.source=n;var o=i.tree.ancestors(e,function(t){return t.parent}),s=o.indexOf(n)+2,u=o.length-(e instanceof a.PseudoState&&e.isHistory()?1:0);return r.toLeave=o[s],r.toEnter=o.slice(s,u).reverse(),i.log.info(function(){return"Created local transition from "+n+" to "+e},i.log.Create),r}return r(n,t),n}(o.Transition);n.LocalTransition=s},function(t,n,e){"use strict";var r=this&&this.__extends||function(){var t=function(n,e){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])})(n,e)};return function(n,e){function r(){this.constructor=n}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}}();n.__esModule=!0;var i=e(0),o=function(t){function n(n){var e=t.call(this,n,n)||this;return e.source=n,i.log.info(function(){return"Created internal transition at "+e.source},i.log.Create),e}return r(n,t),n}(e(1).Transition);n.InternalTransition=o},function(t,n,e){"use strict";n.__esModule=!0;var r=e(16);n.Instance=r.Instance;var i=e(17);n.evaluate=i.evaluate},function(t,n,e){"use strict";n.__esModule=!0;var r=e(2);n.PseudoStateKind=r.PseudoStateKind,n.State=r.State,n.Region=r.Region,n.PseudoState=r.PseudoState,n.ExternalTransition=r.ExternalTransition,n.InternalTransition=r.InternalTransition,n.LocalTransition=r.LocalTransition;var i=e(10);n.Instance=i.Instance;var o=e(0);n.log=o.log,n.random=o.random},function(t,n,e){"use strict";n.__esModule=!0,function(t){t.ok=function(t,n){if(!t)throw new Error(n())}}(n.assert||(n.assert={}))},function(t,n,e){"use strict";n.__esModule=!0,function(t){t.Create=1,t.Entry=2,t.Exit=4,t.Evaluate=8,t.Transition=16,t.Transaction=32,t.User=64,t.All=t.Create|t.Entry|t.Exit|t.Evaluate|t.Transition|t.Transaction|t.User;var n=[];t.add=function(e,r){return void 0===r&&(r=t.All),n.push({callback:e,category:r})-1},t.remove=function(t){n[t]=void 0},t.info=function(t,e){for(var r,i=n.length;i--;){var o=n[i];o&&o.category&e&&o.callback(r||(r=t()))}}}(n.log||(n.log={}))},function(t,n,e){"use strict";n.__esModule=!0,function(t){t.get=function(t){return Math.floor(Math.random()*t)},t.set=function(n){var e=t.get;return t.get=n,e}}(n.random||(n.random={}))},function(t,n,e){"use strict";n.__esModule=!0,function(t){t.ancestors=function(t,n){for(var e=[];t;)e.unshift(t),t=n(t);return e},t.lca=function(t,n){for(var e=Math.min(t.length,n.length),r=0;r<e&&t[r]===n[r];)r++;return r-(r!==e?1:2)}}(n.tree||(n.tree={}))},function(t,n,e){"use strict";var r=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var e in t)Object.hasOwnProperty.call(t,e)&&(n[e]=t[e]);return n.default=t,n};n.__esModule=!0;var i=r(e(2)),o=e(0),a=e(10),s=function(){function t(t,n,e){void 0===e&&(e=void 0);var r=this;this.name=t,this.root=n,this.cleanState={},this.dirtyState={},this.dirtyVertex={},o.assert.ok(!n.parent,function(){return"The state provided as the root for an instance cannot have a parent"}),e?this.transaction(function(){return r.stateFromJSON(r.root,e)}):this.transaction(function(){return r.root.enter(r,!1,void 0)})}return t.prototype.evaluate=function(t){var n=this;return o.log.info(function(){return n+" evaluate "+typeof t+" trigger: "+t},o.log.Evaluate),this.transaction(function(){return a.evaluate(n.root,n,!1,t)})},t.prototype.transaction=function(t){this.dirtyState={},this.dirtyVertex={};for(var n=t(),e=Object.keys(this.dirtyState),r=e.length;r--;)this.cleanState[e[r]]=this.dirtyState[e[r]];return this.dirtyState={},this.dirtyVertex={},n},t.prototype.setVertex=function(t){t.parent&&(this.dirtyVertex[t.parent.qualifiedName]=t)},t.prototype.setState=function(t){t.parent&&(this.dirtyVertex[t.parent.qualifiedName]=t,this.dirtyState[t.parent.qualifiedName]=t)},t.prototype.getState=function(t){return this.dirtyState[t.qualifiedName]||this.cleanState[t.qualifiedName]},t.prototype.getVertex=function(t){return this.dirtyVertex[t.qualifiedName]||this.cleanState[t.qualifiedName]},t.prototype.getLastKnownState=function(t){return this.cleanState[t.qualifiedName]},t.prototype.toJSON=function(t){var n=this;return void 0===t&&(t=this.root),{name:t.name,children:t.children.map(function(t){return n.regionToJSON(t)}).reverse()}},t.prototype.regionToJSON=function(t){var n=this,e=this.getLastKnownState(t);return{name:t.name,children:t.children.filter(function(t){return t instanceof i.State}).reverse().map(function(t){return n.toJSON(t)}),lastKnownState:e?e.name:void 0}},t.prototype.stateFromJSON=function(t,n){for(var e=function(n){var e=t.children.filter(function(t){return t.name===n.name})[0];o.assert.ok(e,function(){return"Unable to find region "+n.name}),r.regionFromJSON(e,n)},r=this,i=0,a=n.children;i<a.length;i++){e(a[i])}},t.prototype.regionFromJSON=function(t,n){for(var e=function(e){var a=t.children.filter(function(t){return t instanceof i.State&&t.name===e.name})[0];o.assert.ok(a,function(){return"Unable to find state "+e.name}),r.stateFromJSON(a,e),a.name===n.lastKnownState&&r.setState(a)},r=this,a=0,s=n.children;a<s.length;a++){e(s[a])}},t.prototype.toString=function(){return this.name},t}();n.Instance=s},function(t,n,e){"use strict";var r=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var e in t)Object.hasOwnProperty.call(t,e)&&(n[e]=t[e]);return n.default=t,n};n.__esModule=!0;var i=r(e(2)),o=e(0);function a(t,n,e,r){var i=function(t,n,e,r){for(var i=!1,o=t.children.length;o--&&(!a(n.getState(t.children[o]),n,e,r)||(i=!0,!t.parent||n.getState(t.parent)===t)););return i}(t,n,e,r)||s(t,n,e,r);return i&&t.parent&&n.getState(t.parent)===t&&c(t,n,e,t),i}function s(t,n,e,r){var o=t.getTransition(r);return!!o&&(function(t,n,e,r){var o=[t];for(;t.target instanceof i.PseudoState&&t.target.kind===i.PseudoStateKind.Junction;)o.unshift(t=t.target.getTransition(r));for(var a=o.length;a--;)o[a].execute(n,e,r)}(o,n,e,r),!0)}function u(t,n){for(var e,r=t.outgoing.length;r--;)t.outgoing[r].guard(n)&&(o.assert.ok(!e,function(){return"Multiple transitions found at "+t+" for "+n}),e=t.outgoing[r]);return e}function c(t,n,e,r){for(var i=t.children.length;i--;)if(0!==n.getState(t.children[i]).outgoing.length)return;s(t,n,e,r)}n.evaluate=a,i.Region.prototype.enter=function(t,n,e){this.enterHead(t,n,e),this.enterTail(t,n,e)},i.Region.prototype.enterHead=function(t,n,e){var r=this;o.log.info(function(){return t+" enter "+r},o.log.Entry)},i.Region.prototype.enterTail=function(t,n,e){var r,a=this,s=this.starting;(n||s&&s.isHistory())&&(r=t.getState(this))&&(s=r,n=n||this.starting.kind===i.PseudoStateKind.DeepHistory),o.assert.ok(s,function(){return t+" no initial pseudo state found at "+a}),s.enter(t,n,e)},i.Region.prototype.leave=function(t,n,e){var r=this;t.getVertex(this).leave(t,n,e),o.log.info(function(){return t+" leave "+r},o.log.Exit)},i.PseudoState.prototype.getTransition=function(t){var n=this,e=(this.kind===i.PseudoStateKind.Choice?function(t,n){for(var e=[],r=t.outgoing.length;r--;)t.outgoing[r].guard(n)&&e.push(t.outgoing[r]);return e[o.random.get(e.length)]}:u)(this,t)||this.elseTransition;return o.assert.ok(e,function(){return"Unable to find transition at "+n+" for "+t}),e},i.PseudoState.prototype.enter=function(t,n,e){this.enterHead(t,n,e),this.enterTail(t,n,e)},i.PseudoState.prototype.enterHead=function(t,n,e){var r=this;o.log.info(function(){return t+" enter "+r},o.log.Entry),t.setVertex(this)},i.PseudoState.prototype.enterTail=function(t,n,e){this.kind!==i.PseudoStateKind.Junction&&s(this,t,n,e)},i.PseudoState.prototype.leave=function(t,n,e){var r=this;o.log.info(function(){return t+" leave "+r},o.log.Exit)},i.State.prototype.getTransition=function(t){return u(this,t)},i.State.prototype.enter=function(t,n,e){this.enterHead(t,n,e),this.enterTail(t,n,e)},i.State.prototype.enterHead=function(t,n,e){var r=this;o.log.info(function(){return t+" enter "+r},o.log.Entry),t.setState(this);for(var i=this.onEnter.length;i--;)this.onEnter[i](e)},i.State.prototype.enterTail=function(t,n,e){for(var r=this.children.length;r--;)this.children[r].enter(t,n,e);c(this,t,n,this)},i.State.prototype.leave=function(t,n,e){for(var r=this,i=this.children.length;i--;)this.children[i].leave(t,n,e);for(o.log.info(function(){return t+" leave "+r},o.log.Exit),i=this.onLeave.length;i--;)this.onLeave[i](e)},i.ExternalTransition.prototype.execute=i.LocalTransition.prototype.execute=function(t,n,e){var r=this;o.log.info(function(){return"Executing transition from "+r.source+" to "+r.target},o.log.Transition),this.toLeave.leave(t,n,e);for(var i=this.actions.length;i--;)this.actions[i](e);for(i=this.toEnter.length;i--;)this.toEnter[i].enterHead(t,n,e);this.toEnter[0].enterTail(t,n,e)},i.InternalTransition.prototype.execute=function(t,n,e){var r=this;o.log.info(function(){return"Executing transition at "+r.target},o.log.Transition);for(var i=this.actions.length;i--;)this.actions[i](e);c(this.source,t,n,this.target)}}]);