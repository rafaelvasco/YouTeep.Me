import api from '@/backend/api'
import { login } from '@/backend/authService'
import { PageSeo } from '@/components/SEO'
import { AuthContext } from '@/contexts/authContext'
import siteMetadata from '@/data/siteMetadata.json'
import { LoginRequest } from '@/types/LoginRequest'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
    redirectToHome: boolean
}

const Login = ({ redirectToHome = true }: Props) => {
    const { storeAuth, loggedIn } = useContext(AuthContext)

    useEffect(() => {}, [])

    const {
        register,
        handleSubmit,
        reset,
        errors,
        setValue,
        formState: { isSubmitSuccessful, isSubmitting },
    } = useForm()

    const router = useRouter()

    const onSubmit = async (data: any) => {
        const user = await login(data as LoginRequest)

        if (user) {
            storeAuth(user)

            reset()

            if (redirectToHome) {
                router.push('/')
            }
        } else {
            setValue('password', '')
        }
    }

    const formOptions = {
        email: { required: 'Name field is required.' },
        password: { required: 'Password field is required.' },
    }

    return (
        <>
            <PageSeo
                title={siteMetadata.title}
                description={siteMetadata.description}
                url={siteMetadata.siteUrl}
            />

            <div className="my-5" hidden={loggedIn}>
                <div className="m-auto flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow dark:bg-gray-800 sm:px-6 md:px-8 lg:px-10">
                    <div className="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white">
                        Login To Your Account
                    </div>
                    <div className="mt-8">
                        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
                            <label className="block">
                                <span className="text-gray-700 dark:text-gray-200">Email:</span>
                                <input
                                    id="email"
                                    autoComplete="off"
                                    ref={register(formOptions.email)}
                                    className="bg-white dark:bg-gray-900 mt-1 block w-full rounded-md border-gray-200 dark:border-gray-800 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    name="email"
                                    type="text"
                                />
                                <small className="text-red-500">
                                    {errors.email && errors.email.message}
                                </small>
                            </label>

                            <label className="block">
                                <span className="text-gray-700 dark:text-gray-200">Password:</span>
                                <input
                                    id="password"
                                    autoComplete="off"
                                    ref={register(formOptions.password)}
                                    className="bg-white dark:bg-gray-900 mt-1 block w-full rounded-md border-gray-200 dark:border-gray-800 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    name="password"
                                    type="password"
                                />
                                <small className="text-red-500">
                                    {errors.password && errors.password.message}
                                </small>
                            </label>

                            <button
                                disabled={isSubmitting}
                                className="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                type="submit"
                            >
                                {!isSubmitting ? 'Login' : 'Please Wait'}
                            </button>
                        </form>
                    </div>
                    <div className="flex items-center justify-center mt-6">
                        <a
                            href="#"
                            target="_blank"
                            className="inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-gray-700 dark:text-gray-100 dark:hover:text-white"
                        >
                            <span className="ml-2">You don&#x27;t have an account?</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
