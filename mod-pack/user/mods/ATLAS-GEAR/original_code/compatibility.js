class compatibility
{
    constructor()
    {
        this.modname = "ATLAS_SR-25 compatibility";
        Logger.info(`Loading: ${this.modname}`);
        ModLoader.onLoad[this.modname] = this.load.bind(this);
    }
    load(SessionID)
    {
        // if modDir exists, add_thisItemId to_thisItemId slot#
        this.itemCompatibility("user/mods/ATLAS_ATL-15/src/ATL15_PGRIP_MIAD.js", "010421_ATL15_PGRIP_MIAD0", "0088_ATL_SR25_FDE_8800", 0)
        this.itemCompatibility("user/mods/ATLAS_ATL-15/src/ATL15_PGRIP_MIAD.js", "010421_ATL15_PGRIP_MIAD0", "5df8ce05b11454561e39243b", 0)
    }
    itemCompatibility(m_dir, add_itemId, to_itemId, slots_Number)
    {
        if (VFS.exists(m_dir)) // check modDir exists
        {
            // add thisItemId to this itemIdSlot# of thisItemId
            DatabaseServer.tables.templates.items[to_itemId]._props.Slots[slots_Number]._props.filters[0].Filter.push(add_itemId);

            // thisModName with breakup modDir, get folderDir [#] remove file extension, log in server    
            Logger.info(`${this.modname} with ${(m_dir.split("/")[4].slice(0, -3))}`);
        }
    }
}
module.exports.compatibility = compatibility;