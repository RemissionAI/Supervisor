import { route as TrainRouter } from './train.route'
import { route as AskRoute } from './ask.route'
import { route as InternalRoute } from './internal.route'

const base_path = 'supervisor/v1'

export const defaultRoutes = [
  {
    path: `${base_path}/train`,
    route: TrainRouter,
  },
  {
    path: `${base_path}/ask`,
    route: AskRoute,
  },
  {
    path: `${base_path}/internal`,
    route: InternalRoute,
  },
]
