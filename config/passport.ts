import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { getUserById } from '../services/user.service';
import keys from './keys';

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.secretOrKey
}

const passportMiddleware = new Strategy(jwtOptions, async (payload, done) => {
  try {
    const user = await getUserById(payload.id);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    console.log(error);
  }
})

export default passportMiddleware