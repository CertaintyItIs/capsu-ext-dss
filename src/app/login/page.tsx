import { login, signup } from './actions'

export default function Login() {
        
    return (
        <div className="flex flex-col gap-5 p-10 bg-white rounded-lg shadow-md">

        <form>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Login</legend>
                <legend className="fieldset-legend">Email</legend>
                <input className="input input-neutral border" id="email" name="email" type="email" required /> 
                <legend className="fieldset-legend">Password</legend>
                <input className="input input-neutral border" id="password" name="password" type="password" required />
            </fieldset>
            <div>
                <button className="btn" formAction={login}>Log in</button>
                <button className="btn" formAction={signup}>Sign up</button>
            </div>
            
      </form>
      </div>

    )
}