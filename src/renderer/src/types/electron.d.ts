interface ServiceHealth {
  onHealthUpdate: (callback: (data: any) => void) => void
}

interface Api {
  serviceHealth: ServiceHealth
}

interface Window {
  api: Api
}
