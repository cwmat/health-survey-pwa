import { MagicStrings } from "./magic-strings.model";

export class UserMessages {
    // Location page
    public static LocationHelperText: string = 'Search for an address or click "Select Location" and click on the map, then click "Save Location".';

    // Contact page
    public static ContactHelperText: string = 'Provide your contact information in case the Game Commission or the Wildlife Futures Program needs to contact you to discuss your observation.';

    // Map page
    public static OfflineMap: string = 'Looks like you currently have limited network connection.  Loading a simplified offline map view until connection is restored.';

    // Animal page
    public static AnimalHelperText: string = 'Provide the details of your bird or mammal observation. Any amphibian, fish, or reptile observations should be directed to the <a href="https://www.fishandboat.com/Pages/default.aspx" target="_blank">Pennsylvania Fish and Boat Commission</a>. Any domestic animal observations should be directed to the <a href="https://www.agriculture.pa.gov/Pages/default.aspx" target="_blank">Pennsylvania Department of Agriculture</a>. <em><span class="appRed">*</span> Denotes Required Field.</em>';
    public static PhotosHelperText: string = 'Total size of all files cannot exceed 25 MB.';
    public static RabiesPopup: string = '<p>Signs vary but mammals infected with rabies may exhibit unusual behavior such as aggression, vocalization, excessive drooling, tameness or a lack of fear of humans, difficulty standing or walking, paralysis, circling, incoordination, or head tilt. Mammals infected with rabies may also appear normal or have very subtle or non-specific clinical signs of infection. Click <a href="https://www.pa.gov/guides/foodborne-animal-transmitted-illnesses/#rabies" target="_blank">here</a> for additional details on the rabies virus and how it impacts human and animal health.</p>';
    public static CaptivePopup: string = 'Is the animal from a captive facility or did it come from the wild? Captive animals may have collars or ear tags.';
    public static PoachingPopup: string = '<p>The illegal shooting or taking of big game or protected, endangered or threatened species, or any crime against those species should be reported through <a href="https://www.CLIENT.pa.gov/HuntTrap/Law/Pages/OperationGameThief.aspx" target="_blank">Operation Game Thief</a> by calling <a href="tel:1-888-742-8001">1-888-CLIENT-8001</a> or submitting a report <a href="https://CLIENTdatacollection.pa.gov/operationgamethief" target="_blank">online</a>.</p>';
    public static CurrentlyOffline: string = '<p>You are currently offline or are in an area with poor connectivity and your Observation cannot be submitted at this time.</p><p>Click <strong>"Save and Return Home"</strong> to save your observation to your device so it can be uploaded when you are connected again.</p><p>Or click <strong>"Close"</strong> to stay on the page.</p>';

    // File Upload
    public static UploadTooLarge: string = 'Your files are too large.  Please make sure they do not exceed 25MB.';
    public static UploadWrongType: string = 'Some or all of your files did not upload due to an incorrect file type.';

    // Home
    public static UploadTooltip: string = 'Looks like you have some Observations that were saved on your device while you were offline.  Now that you are online again, you can upload them.';

    // Confirmation
    public static BulkUploadConfirmation = `Thank you for submitting an observation to the Pennsylvania Game Commission's ${MagicStrings.AppName}.`;
    public static ConfirmSubmit = 'Are you sure you want to submit your wildlife health observation?';
    public static ConfirmActionNeededShort = `<p>Based on your observation details, further investigation by a State Game Warden may be required. Please immediately call the Game Commission at <a href="tel:${MagicStrings.GameCommissionPhone}">${MagicStrings.GameCommissionPhone}</a>.</p>`;
    public static ConfirmNoActionNeededShort = '<p>Based on your observation details, the Game Commission or the Wildlife Futures Program may contact you for additional information. Follow-up contact is not guaranteed but recent observations are prioritized.</p>';
}

export interface ConfirmationSettings {
    title : string
    text : string;
    confirm : string;
    cancel : string;
    extraSpace?: boolean;
}
