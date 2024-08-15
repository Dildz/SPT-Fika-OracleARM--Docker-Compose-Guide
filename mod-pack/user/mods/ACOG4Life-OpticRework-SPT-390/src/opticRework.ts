/*
* OpticRework Class
* Original Code by ACOGforlife and SAMSWAT
* Refactor for typescript by Tuhjay
* written for AKI 3.0.0
* Last Change made July 6th 2022
*/

import { injectable } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { DependencyContainer } from "@spt/models/external/tsyringe";

@injectable()
export class opticRework 
{
    public runModLogic(container: DependencyContainer): string 
    {
        //connect to the "server"
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        //initialize database table
        const tables = databaseServer.getTables();
        //initialize array of items
        const item = tables.templates.items;

        /*
        * New typescript has a few differences compared to JS
        *
        * Object creation from the database is going to be pass by reference
        * This means that any change made to the variable also changes the original object
        * So we do not have to clone the object, make changes, and then replace the original with the clone
        * We only need to edit the variable we create for our changes to made
        * 
        * Example:
        * const *yourchosennamefortheitem* = item["*itemIDgrabbedfromdatabase*"];
        * We then make changes to your new variable and these are reflected by the original
        * 
        * For a list of item IDs visit the database created by the SPT AKI team https://db.sp-tarkov.com/search
        * For the list of targetable attributes look up your selected item in the items.json located in *Yourinstallationpath*\Aki_Data\Server\database\templates
        * 
        * Change ergonomics of a scope:
        * const bravo4 = item["57adff4f24597737f373b6e6"];
        * bravo4._props.Ergonomics = 50;
        * When in game you should now see that the bravo 4x scope adds 50 ergo rather than subtracting 2
        * 
        */
        const bravo4 = item["57adff4f24597737f373b6e6"];
        bravo4._props.AimSensitivity[0] = [0.2025];
        //bravo4._props.Ergonomics = 50;  Test case use to easily verify that we  actually do things to the items.

        let sb_pm_ii_1_8x24 = item["617151c1d92c473c770214ab"];
        sb_pm_ii_1_8x24._props.AimSensitivity[0] = [
            0.14,
            0.62
        ];
        sb_pm_ii_1_8x24._props.Zooms[0] = [
            8,
            1
        ]
        sb_pm_ii_1_8x24._props.OpticCalibrationDistances = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400,
            450,
            500,
            550,
            600,
            650
        ]
        sb_pm_ii_1_8x24._props.CalibrationDistances[0] = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400,
            450,
            500,
            550,
            600,
            650
        ]
        

        let vortex_hd_genii = item["618ba27d9008e4636a67f61d"];
        vortex_hd_genii._props.OpticCalibrationDistances = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400,
            450,
            500,
            550,
            600,
            650
        ]
        vortex_hd_genii._props.CalibrationDistances[0] = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400,
            450,
            500,
            550,
            600,
            650
        ]

        let sb_pm_ii_3_12x50 = item["61714eec290d254f5e6b2ffc"];
        sb_pm_ii_3_12x50._props.AimSensitivity[0] = [
            0.03,
            0.125
        ];
        sb_pm_ii_3_12x50._props.Zooms[0] = [
            12,
            3
        ]
        sb_pm_ii_3_12x50._props.OpticCalibrationDistances = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400,
            450,
            500,
            550,
            600,
            650
        ]
        sb_pm_ii_3_12x50._props.CalibrationDistances[0] = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400,
            450,
            500,
            550,
            600,
            650
        ]
        
        let hamrmk4 = item["544a3a774bdc2d3a388b4567"];
        hamrmk4._props.AimSensitivity[0] = [0.2025];
        //hamrmk4._props.Ergonomics = 50;
        
        
        let ta01nsn = item["5c05293e0db83400232fff80"];
        ta01nsn._props.AimSensitivity[0] = [0.2025];
        
        let ta01nsntan = item["5c052a900db834001a66acbd"];
        ta01nsntan._props.AimSensitivity[0] = [0.2025];
        
        let elcanspecterdr = item["57ac965c24597706be5f975c"];
        elcanspecterdr._props.Slots[0]._props.filters[0].Filter = [
            "5a32aa0cc4a28232996e405f",
            "5a33b2c9c4a282000c5a9511",
            "577d128124597739d65d0e56"
        ]
        elcanspecterdr._props.AimSensitivity[0] = [
            0.2025,
            0.7
        ]
        
        let elcanspecterdrfde = item["57aca93d2459771f2c7e26db"];
        elcanspecterdrfde._props.Slots[0]._props.filters[0].Filter = [
            "5a32aa0cc4a28232996e405f",
            "5a33b2c9c4a282000c5a9511",
            "577d128124597739d65d0e56"
        ]
        elcanspecterdrfde._props.AimSensitivity[0] = [
            0.2025,
            0.7
        ]
        
        let acogta11 = item["59db7e1086f77448be30ddf3"];
        acogta11._props.AimSensitivity[0] = [0.2643];
        
        let valdayps320 = item["5c0517910db83400232ffee5"];
        valdayps320._props.AimSensitivity[0] = [
            0.1883,
            0.7
        ]
        
		let vss = item["57838ad32459774a17445cd2"];
        vss._props.SightingRange = 25;
        vss._props.IronSightRange = 25;

		let val = item["57c44b372459772d2b39b8ce"];
        vss._props.SightingRange = 25;
        vss._props.IronSightRange = 25;

        let xps32 = item["584924ec24597768f12ae244"];
        xps32._props.OpticCalibrationDistances = [
            25,
			50,
			100,
			150,
			200
        ]
        xps32._props.CalibrationDistances[0] = [
            25,
			50,
			100,
			150,
			200
        ]
        
        let srs2 = item["5d2da1e948f035477b1ce2ba"];
        srs2._props.OpticCalibrationDistances = [
            25,
			50,
			100,
			150,
			200
        ]
        srs2._props.CalibrationDistances[0] = [
            25,
			50,
			100,
			150,
			200
        ]
        
        let xps30 = item["58491f3324597764bc48fa02"];
        xps30._props.OpticCalibrationDistances = [
            25,
			50,
			100,
			150,
			200
        ]
        xps30._props.CalibrationDistances[0] = [
            25,
			50,
			100,
			150,
			200
        ]
        
        let eotech553 = item["570fd6c2d2720bc6458b457f"];
        eotech553._props.OpticCalibrationDistances = [
            25,
			50,
			100,
			150,
			200
        ]
        eotech553._props.CalibrationDistances[0] = [
            25,
			50,
			100,
			150,
			200
        ]
        
        let hs401g5 = item["5b30b0dc5acfc400153b7124"];
        hs401g5._props.OpticCalibrationDistances = [
            25,
			50,
			100,
			150,
			200
        ]
        hs401g5._props.CalibrationDistances[0] = [
            25,
			50,
			100,
			150,
			200
        ]
        
        let compm4 = item["5c7d55de2e221644f31bff68"];
        compm4._props.OpticCalibrationDistances = [
            25,
			50,
			100,
			150,
			200
        ]
        compm4._props.CalibrationDistances[0] = [
            25,
			50,
			100,
			150,
			200
        ]
        
        let p90ring = item["5cebec38d7f00c00110a652a"];
        p90ring._props.OpticCalibrationDistances = [
            25,
			50,
			100,
			150,
			200
        ]
        p90ring._props.CalibrationDistances[0] = [
            25,
			50,
			100,
			150,
			200
        ]
        
        let hhs1tan = item["5c0a2cec0db834001b7ce47d"];
        hhs1tan._props.AimSensitivity[0] = [
            0.2867,
            0.7
        ]
        hhs1tan._props.OpticCalibrationDistances = [
            25,
			50,
			100,
			150,
			200
        ]
        hhs1tan._props.CalibrationDistances[0] = [
            25,
			50,
			100,
			150,
			200
        ]
        
        let exps3 = item["558022b54bdc2dac148b458d"];
        exps3._props.OpticCalibrationDistances = [
            25,
            50,
            100,
            150,
            200
        ]
        exps3._props.CalibrationDistances[0] = [
            25,
            50,
            100,
            150,
            200
        ]
        
        let hhs1 = item["5c07dd120db834001c39092d"];
        hhs1._props.AimSensitivity[0] = [
            0.2867,
            0.7
        ]
        hhs1._props.OpticCalibrationDistances = [
            25,
			50,
			100,
			150,
			200
        ]
        hhs1._props.CalibrationDistances[0] = [
            25,
			50,
			100,
			150,
			200
        ]
        
        let okp7dovetail = item["57486e672459770abd687134"];
        okp7dovetail._props.OpticCalibrationDistances = [
            25,
            50,
            100,
            150,
            200
        ]
        okp7dovetail._props.CalibrationDistances[0] = [
            25,
            50,
            100,
            150,
            200
        ]
        
        let valday1p78 = item["5c0505e00db834001b735073"];
        valday1p78._props.OpticCalibrationDistances = [
            25,
            50,
            100,
            150,
            200
        ]
        valday1p78._props.CalibrationDistances[0] = [
            25,
            50,
            100,
            150,
            200
        ]
        
        let aksionekp818 = item["591c4efa86f7741030027726"];
        aksionekp818._props.OpticCalibrationDistances = [
            25,
            50,
            100,
            150,
            200
        ]
        aksionekp818._props.CalibrationDistances[0] = [
            25,
            50,
            100,
            150,
            200
        ]
        
        let aksionekp802 = item["5947db3f86f77447880cf76f"];
        aksionekp802._props.OpticCalibrationDistances = [
            25,
            50,
            100,
            150,
            200
        ]
        aksionekp802._props.CalibrationDistances[0] = [
            25,
            50,
            100,
            150,
            200
        ]
        
        let walthermrs = item["570fd721d2720bc5458b4596"];
        walthermrs._props.OpticCalibrationDistances = [
            25,
            50,
            100,
            150,
            200
        ]
        walthermrs._props.CalibrationDistances[0] = [
            25,
            50,
            100,
            150,
            200
        ]
        
        let romeo8t = item["60a23797a37c940de7062d02"];
        romeo8t._props.OpticCalibrationDistances = [
            25,
            50,
            100,
            150,
            200
        ]
        romeo8t._props.CalibrationDistances[0] = [
            25,
            50,
            100,
            150,
            200
        ]
        
        let valdaykrechet = item["609a63b6e2ff132951242d09"];
        valdaykrechet._props.OpticCalibrationDistances = [
            25,
            50,
            100,
            150,
            200
        ]
        valdaykrechet._props.CalibrationDistances[0] = [
            25,
            50,
            100,
            150,
            200
        ]
        
        let pilad142 = item["584984812459776a704a82a6"];
        pilad142._props.OpticCalibrationDistances = [
            25,
            50,
            100,
            150,
            200
        ]
        pilad142._props.CalibrationDistances[0] = [
            25,
            50,
            100,
            150,
            200
        ]
        
        let okp7 = item["570fd79bd2720bc7458b4583"];
        okp7._props.OpticCalibrationDistances = [
            25,
            50,
            100,
            150,
            200
        ]
        okp7._props.CalibrationDistances[0] = [
            25,
            50,
            100,
            150,
            200
        ]
        
        let razoramguh1 = item["59f9d81586f7744c7506ee62"];
        razoramguh1._props.OpticCalibrationDistances = [
            25,
            50,
            100,
            150,
            200
        ]
        razoramguh1._props.CalibrationDistances[0] = [
            25,
            50,
            100,
            150,
            200
        ]
        
        let kmz1p69 = item["5d0a3e8cd7ad1a6f6a3d35bd"];
        kmz1p69._props.AimSensitivity[0] = [
            0.2067,
            0.2067,
            0.08,
            0.08
        ]
        
        let pu35 = item["5b3f7c1c5acfc40dc5296b1d"];
        pu35._props.AimSensitivity[0] = [
            0.2629
        ]
        
        let nightforceatacr = item["5aa66be6e5b5b0214e506e97"];
        nightforceatacr._props.AimSensitivity[0] = [
            0.1014,
            0.0713
        ]
        nightforceatacr._props.Zooms[0] = [
            7,
            18
        ]
        nightforceatacr._props.OpticCalibrationDistances = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400,
            450,
            500,
            550,
            600,
            650
        ]
        nightforceatacr._props.CalibrationDistances[0] = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400,
            450,
            500,
            550,
            600,
            650
        ]
        
        let ncstaradop4 = item["5dfe6104585a0c3e995c7b82"];
        ncstaradop4._props.AimSensitivity[0] = [
            0.22,
            0.0767
        ]
        
        let pso1m2 = item["5c82343a2e221644f31c0611"];
        pso1m2._props.AimSensitivity[0] = [
            0.2025,
            0.2025
        ]
        
        let pso1m21 = item["576fd4ec2459777f0b518431"];
        pso1m21._props.AimSensitivity[0] = [
            0.2025,
            0.2025
        ]
        
        let mark4lr = item["5a37cb10c4a282329a73b4e7"];
        mark4lr._props.AimSensitivity[0] = [
            0.06
        ]
        mark4lr._props.Zooms[0] = [
            8
        ]
        mark4lr._props.OpticCalibrationDistances = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400,
            450,
            500,
            550,
            600,
            650
        ]
        mark4lr._props.CalibrationDistances[0] = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400,
            450,
            500,
            550,
            600,
            650
        ]
        
        let fullfieldtac30 = item["5b2388675acfc4771e1be0be"];
        fullfieldtac30._props.AimSensitivity[0] = [
            0.7,
            0.15
        ]
        
        let eotechvudu = item["5b3b99475acfc432ff4dcbee"];
        eotechvudu._props.AimSensitivity[0] = [
            0.15,
            0.7
        ]
        
        let pso1 = item["5c82342f2e221644f31c060e"];
        pso1._props.AimSensitivity[0] = [
            0.2025,
            0.2025
        ]
        
        let pilad4x32 = item["5dff772da3651922b360bf91"];
        pilad4x32._props.AimSensitivity[0] = [
            0.2025
        ]
        
        let marchtactical = item["57c5ac0824597754771e88a9"];
        marchtactical._props.AimSensitivity[0] = [
            0.1093
        ]
        marchtactical._props.Zooms[0] = [
            8
        ]
        
        let kmz1p59 = item["5d0a3a58d7ad1a669c15ca14"];
        kmz1p59._props.AimSensitivity[0] = [
            0.2267,
            0.2267,
            0.08,
            0.08
        ]
        
        let flirrs32 = item["5d1b5e94d7ad1a2b865a96b0"];
        flirrs32._props.AimSensitivity[0] = [
            0.3511,
            0.0978
        ]
        flirrs32._props.OpticCalibrationDistances = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400
        ]
        flirrs32._props.CalibrationDistances[0] = [
            50,
            100,
            150,
            200,
            250,
            300,
            350,
            400
        ]
       
        let hensoldtff4 = item["56ea70acd2720b844b8b4594"];
        hensoldtff4._props.Zooms[0] = [
            4,
            12
        ]
        
        return "done";
    }

}