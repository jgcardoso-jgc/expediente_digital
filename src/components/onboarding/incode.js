const apiURL = "https://demo-api.incodesmile.com/";
const apiKey = "570c70d1693636fdc200713415ebc3973afbdf19";

const incode = window.OnBoarding.create(
	{
		apiKey: apiKey,
  		apiURL: apiURL,
  		lang: "es",
	    theme: {
	      main: "red",
	      mainButton: {
	        borderRadius: "20px",
	        color: "white",
	        border: "2px solid black"
	      }
		},
	    translations: {
	      tutorial: {
	        front1: "Seguridata Onboarding",
	        front2: "Scan ID",
	        back1: "Now scan the ",
	        back2: "back side ",
	        back3: "of your ID",
	        selfie1: "Let's take a selfie",
	        selfie2: "Keep a neutral expression, find balanced",
	        selfie3: "light and remove any glasses and hats",
	        passport1: "Align your passport to the frame and take a photo",
	        passport2: "Position just the page with the photo"
	      }
	    }
	}
);
export default incode;
