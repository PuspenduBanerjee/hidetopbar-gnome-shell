/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Util from 'resource:///org/gnome/shell/misc/util.js';
import {panel, wm} from 'resource:///org/gnome/shell/ui/main.js';
import * as Config from 'resource:///org/gnome/shell/misc/config.js';
import * as ExtensionUtils from 'resource:///org/gnome/shell/misc/extensionUtils.js';

// import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as QuickSettings from 'resource:///org/gnome/shell/ui/quickSettings.js';

// import * as ExtensionUtils from 'resource:///org/gnome/shell/misc/extensionUtils.js';

// const Me = Extension.lookupByUUID('hidetopbar@puspendu.banerjee.gmail.com');

import  * as PanelVisibilityManager from './panelVisibilityManager.js';
import * as Convenience from './convenience.js';

// const DEBUG = Convenience.DEBUG;

export default class PlainExampleExtension extends Extension {

    mSettings= null;
    mPVManager= null;
    monitorIndex= null;

   /**
     * This class is constructed once when your extension is loaded, not
     * enabled. This is a good time to setup translations or anything else you
     * only do once.
     *
     * You MUST NOT make any changes to GNOME Shell, connect any signals or add
     * any event sources here.
     *
     * @param {ExtensionMeta} metadata - An extension meta object
     */
   constructor(metadata) {
    super(metadata);

        console.debug(`constructing ${this.metadata.name}`);
    }

     enable() {
        let extensionObject = Extension.lookupByURL(import.meta.url);
        this.mSettings = extensionObject.getSettings();
        this.monitorIndex = Main.layoutManager.primaryIndex;
        this.mPVManager = new PanelVisibilityManager.PanelVisibilityManager(this.mSettings, this.monitorIndex);
    }
    
     disable() {
        console.info("disable()");
        this.mPVManager.destroy();
        this.mSettings.run_dispose();
    
        this.mPVManager = null;
        this.mSettings = null;
    }
}
