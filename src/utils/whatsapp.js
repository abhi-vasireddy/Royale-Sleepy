export const WHATSAPP_NUMBER = '919999999999' // Replace with actual number

export const openWhatsApp = (message = '') => {
  const defaultMsg = 'Hi! I am interested in your mattresses at Royale Sleepy, Berhampur.'
  const text = message || defaultMsg
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

export const productWhatsApp = (productName) => {
  const msg = `Hi! I am interested in the "${productName}" mattress at Royale Sleepy, Berhampur. Please share more details.`
  openWhatsApp(msg)
}
