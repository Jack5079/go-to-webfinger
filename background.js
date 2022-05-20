async function resolve(mention) {
	// Strip @ from start of mention, if present
	if (mention.startsWith('@')) {
		mention = mention.substring(1)
	}
	const domain = mention.split('@')[1]
	const response = await fetch(
		`https://${domain}/.well-known/webfinger?resource=acct:${mention}`,
		{
			headers: {
				Accept: 'application/jrd+json',
			},
		}
	).then((response) => response.json())

	return (
		response.links.find(
			(link) => link.rel === 'http://webfinger.net/rel/profile-page'
		)?.href ?? response.aliases[0]
	)
}

chrome.omnibox.onInputEntered.addListener(async (text) => {
	// Encode user input for special characters , / ? : @ & = + $ #

	// chrome.tabs.create({ url: await resolve(text) })
	const [tab] = await chrome.tabs.query({
		active: true,
		lastFocusedWindow: true,
	})

	chrome.tabs.update(tab.id, { url: await resolve(text) })
})
