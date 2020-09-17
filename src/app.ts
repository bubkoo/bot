import { Application } from 'probot'
import { Checker } from './checker'
import { Welcome } from './welcome'
import { AutoAssign } from './auto-assign'

export = (app: Application) => {
  Checker.start(app)
  Welcome.start(app)
  AutoAssign.start(app)
}
