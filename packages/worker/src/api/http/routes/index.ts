import { route as TrainRouter } from './train.route'

const base_path = 'supervisor/v1'

export const defaultRoutes = [
  {
    path: `${base_path}/train`,
    route: TrainRouter,
  },
]
