/**
 * @prop {boolean}  			settings.isPrettyMode
 * If true, display users photos and names
 *
 * @prop {boolean}              settings.isBlurMode (#TODO)
 * If true, the messages will not be deleted from the DOM, they
 * will simply be blurred
 *
 * @prop {boolean}              settings.isHideOnlyInChats (#TODO)
 * If true, the messages will hide only in chats
 *
 * @prop {boolean}              settings.isAutoCensorship (#TODO)
 * If true, the messages with inappropriate content will be hidden.
 * 
 * @prop {boolean}              settings.isHideFooter (#TODO)
 * If true, the footer will be hidden.
 */
export default interface SettingsInterface {
	isPrettyMode: boolean;
	isBlurMode: boolean;
	isHideOnlyInChats: boolean;
	isAutoCensorship: boolean;
	isHideFooter: boolean;
}