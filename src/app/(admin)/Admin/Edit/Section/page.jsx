'use client';
import { useUser } from '@/context/Context'
import { onAuth, signUpWithEmail, writeUserData, removeData, getSpecificData } from '@/firebase/utils'
import { uploadIMG } from '@/firebase/storage'
import { Suspense } from 'react'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import style from '@/app/page.module.css'
import Button from '@/components/Button'
import InputFlotante from '@/components/InputFlotante'
import Loader from '@/components/Loader'
import ScrollAnimation from 'react-animate-on-scroll';
import "animate.css/animate.compat.css"
import { generateUUID } from '@/utils/UIDgenerator'
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal'
import TextEditor from '@/components/TextEditor'
import TextEditorSimple from '@/components/TextEditorSimple'

// import { useSearchParams } from 'next/navigation'






export default function Home() {



    // const Button = ({ children }) => {
    //     return <Suspense ><button className='bg-[#ffbd2f] w-[200px] p-2 rounded-[5px] inline'>
    //         {children}
    //     </button></Suspense>
    // }
    const { user, introVideo, userDB, option, setOption, setUserProfile, setUserSuccess, success, setUserData, postsIMG, setUserPostsIMG, item, cliente, setCliente, cart, setCart, modal, setModal } = useUser()
    const router = useRouter()

    const [itemEdit, setItemEdit] = useState([''])

    //    console.log(window.location.href.split('=')[1]) 
    const [textEditor, setTextEditor] = useState(undefined)
    const [textEditor2, setTextEditor2] = useState(undefined)

    // const searchParams = useSearchParams()
    const [query, setQuery] = useState('')



    const [data, setData] = useState({})
    const [data2, setData2] = useState({})
    const [data3, setData3] = useState({})

    const [dataURL, setDataURL] = useState({})
    const [dataURL2, setDataURL2] = useState({})
    const [check, setCheck] = useState(false)

    function onChangeHandler(e) {
        setData({ ...data, [e.target.name]: e.target.value })
    }


    function handlerImage(e) {
        setDataURL({
            ...dataURL,
            [e.target.name]: URL.createObjectURL(e.target.files[0]),
            file: e.target.files[0]
        })
    }



    // --------------------------mini tarjetas 2----------------------------------
    function handlerLess2() {
        let db = { ...data2 };
        delete db[`item${data2 !== undefined && Object.keys(data2).length - 1}`];
        return setData2(db)
    }

    function onChangeHandler2(e, i) {
        setData2({ ...data2, [i]: { ...data2[i], [e.target.name]: e.target.value } })
    }



    // --------------------------tarjetas 3----------------------------------

    function onChangeHandler3(e, i) {
        setData3({ ...data3, [i]: { ...data3[i], [e.target.name]: e.target.value } })
    }
    function onChangeHandler4(e, i) {
        console.log(e)
        console.log(i)
        setData3({ ...data3, [i]: { ...data3[i], paragraph: e } })
    }






    function saveFrontPage(e) {
        e.preventDefault()
        setUserSuccess('Cargando')
        writeUserData(`/Cliente/${query}`, { ...data, content: textEditor, miniTarjetas: data2 }, setUserSuccess)

        // if (e.target[0].files[0]) {
        //     uploadIMG(`/Cliente/${query}`, '/', query, dataURL.file, { ...data, content: textEditor, miniTarjetas: data2 }, setUserSuccess)
        // } else {
        //     writeUserData(`/Cliente/${query}`, { ...data, content: textEditor, miniTarjetas: data2 }, setUserSuccess)
        // }
    }
    function saveMiniTarjetas(e) {
        e.preventDefault()
        setUserSuccess('Cargando')
        writeUserData(`/Cliente/${query}`, { miniTarjetas: data2 }, setUserSuccess)
    }
    function saveFrontPage2(e) {
        e.preventDefault()
        setUserSuccess('Cargando')
        Object.entries(data3).map(i => {
            let db = { ...i[1] }
            delete db['file']
            if (i[1].file && i[1].file !== undefined) {
                uploadIMG(`/Cliente/${query}/tarjetas/${[i[0]]}`, '/', `/${query}/tarjetas/${[i[0]]}`, i[1].file, db, setUserSuccess)
            } else {
                writeUserData(`/Cliente/${query}/tarjetas`, { [i[0]]: db }, setUserSuccess)
            }
        })
    }


    function addContact(e) {
        e.preventDefault()
        setUserSuccess('Cargando')
        const obj = {
            [e.target[0].name]: e.target[0].value,
            [e.target[1].name]: e.target[1].value,
            [e.target[2].name]: e.target[2].value,
            [e.target[3].name]: e.target[3].value,
            [e.target[4].name]: e.target[4].value,
            [e.target[5].name]: e.target[5].value,
            [e.target[6].name]: e.target[6].value,
            [e.target[7].name]: e.target[7].value,
            [e.target[8].name]: e.target[8].value,
            [e.target[9].name]: e.target[9].value,
        }
        writeUserData(`Cliente/contactos/`, obj, setUserSuccess)
    }

    function close(e) {
        // setUserModal(false)
        // setCheck(false)
        router.back()
    }
    function getDB() {
        getSpecificData('/Cliente', setCliente)
        console.log('ejec')

    }

    function deleteHandler(e, route, key) {
        e.preventDefault()
        setUserSuccess('Cargando')
        removeData(route, setUserSuccess, getDB)
    }

    console.log(query)

    useEffect(() => {
        if (window && typeof window !== "undefined") {
            setQuery(window.location.href.split('=')[1])
        }

        if (cliente && cliente[query] && cliente[query] && cliente[query].miniTarjetas) {
            setData2({ ...cliente[query].miniTarjetas })
        }
        if (cliente && cliente[query] && cliente[query] && cliente[query].tarjetas) {
            console.log('getData3')
            setData3({ ...cliente[query].tarjetas })
        }


    }, [cliente])


    useEffect(() => {
        console.log(Object.keys(data3).length === 0 && cliente && cliente[query] && cliente[query] && cliente[query].tarjetas)
        if (Object.keys(data2).length === 0 && cliente && cliente[query] && cliente[query] && cliente[query].miniTarjetas) {
            setData2({ ...cliente[query].miniTarjetas, ...data2, })
        }
        if (Object.keys(data3).length === 0 && cliente && cliente[query] && cliente[query] && cliente[query].tarjetas) {
            console.log('getData3')
            setData3({ ...cliente[query].tarjetas, ...data2, })
        }
        if (textEditor == undefined && cliente && cliente[query] && cliente[query] && cliente[query].content) {
            console.log('text')
            setTextEditor(cliente[query].content)
        }
    }, [textEditor, data2, data3, query, option, cliente, success])
    console.log(data3)
    return (

        <div className="min-h-full">

            <img src="/airplane-bg.jpg" className='fixed  w-screen h-screen  object-cover  ' alt="" />

            <div className="fixed top-0 left-0 flex justify-center w-full h-auto bg-[#000000b4] p-0 z-40 " >

                <div className="relative w-[95%] h-screen overflow-y-scroll lg:w-[50%] bg-white border-b border-gray-900/10 pt-16 pb-16 lg:pb-4 px-5">
                    <div className="absolute w-[50px] top-5 right-5 text-white p-1 rounded-tl-lg rounded-br-lg text-center bg-red-600" onClick={close}>
                        X
                    </div>

                    <div className='w-full'>
                        <ul className="flex border-b border-[blue] ">
                            <li className={`-mb-px mr-1 ${option === 'Seccion' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => setOption('Seccion')}>
                                <span className=" inline-block rounded-t py-2 px-2 text-blue-700 font-semibold" href="#">Seccion</span>
                            </li>
                            <li className={`-mb-px mr-1 ${option === 'MiniTarjetas' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => setOption('MiniTarjetas')}>
                                <span className=" inline-block rounded-t py-2 px-2 text-blue-500 font-semibold" href="#">MiniTarjetas</span>
                            </li>
                            {query !== 'inicio' && <li className={`-mb-px mr-1 ${option === 'Tarjetas' && 'bg-[#F7BE38] border border-[blue] border-b-transparent'}`} onClick={() => setOption('Tarjetas')}>
                                <span className=" inline-block rounded-t py-2 px-2 text-blue-500  font-semibold" href="#">Tarjetas</span>
                            </li>}
                        </ul>

                    </div>

                    {option === 'Seccion' && <form className="relative  pt-5" onSubmit={saveFrontPage} >
                        <div className="col-span-full">
                            <h2 className="text-base font-bold leading-7 text-gray-900  text-center p-5 ">ADMINISTRAR SECCIONES</h2>
                            <div className='flex justify-center p-5'>
                                <Suspense >
                                    <video src={data && data.url && data.url ? data.url : (cliente && cliente[query] && cliente[query].url)} className='h-[300px]' autoPlay loop muted playsInline ></video>
                                </Suspense >
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="last-name" className="block text-[12px] font-medium leading-6 text-gray-900">Subir Video por URL</label>
                            <input type="text" name="url" onChange={onChangeHandler} className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente[query] && cliente[query].url} />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="last-name" className="block text-[12px] font-medium leading-6 text-gray-900">Titulo</label>
                            <input type="text" name="titulo" onChange={onChangeHandler} className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente[query] && cliente[query].titulo} />
                        </div>
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-[12px] font-medium leading-6 text-gray-900">Contenido de texto</label>
                                    <TextEditor value={textEditor} setValue={setTextEditor} edit={true} ></TextEditor>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-x-6">
                            <Button type="submit" theme="Primary">Guardar</Button>
                        </div>
                    </form>}

                    {option === 'MiniTarjetas' && <form className="relative  pt-5" onSubmit={saveMiniTarjetas} >
                        <Link href={`/Admin/Edit/Add?item=${query}`} className='fixed bottom-[100px] right-[100px]  rounded-full z-50 block font-medium '>
                            <div className="absolute top-5 left-5  p-1 border text-white border-white rounded-full h-[50px] w-[50px] text-center flex items-center justify-center bg-[#F1BA06]" >
                                ADD
                            </div>
                        </Link>
                        {/* ---------------------------------TARJETAS 2---------------------------------------- */}
                        {data2 && data2 !== undefined && Object.entries(data2).map((i, index) => {
                            return <div className="space-y-5 md:space-y-0 md:grid md:grid-cols-2  md:gap-2 pb-5 border-b-[.5px] mb-5 border-[#666666]" key={`input-${index}`}>
                                <h4 className='col-span-2  text-base font-bold leading-7 text-gray-900  text-center p-5'>MINI TARJETA</h4>
                                < InputFlotante type="text" name={`ip`} id={`floating_1`} onChange={(e) => onChangeHandler2(e, i[0])} value={data2[i[0]] && data2[i[0]]['ip'] ? data2[i[0]]['ip'] : i[1][`ip`]} required label={'Item principal'} shadow='shadow-white' />
                                < InputFlotante type="text" name={`ic`} id={`floating_2`} onChange={(e) => onChangeHandler2(e, i[0])} value={data2[i[0]] && data2[i[0]]['ic'] ? data2[i[0]]['ic'] : i[1][`ic`]} required label={'Item contenido'} shadow='shadow-white' />
                                <div className="col-span-2 mt-6 flex items-center justify-center gap-x-6">
                                    <Button type="button" theme="Danger" click={(e) => deleteHandler(e, `Cliente/${query}/miniTarjetas/${i[0]}`, i[0])}>Eliminar</Button>
                                    <Button type="submit" theme="Primary">Guardar</Button>
                                </div>

                            </div>
                        })
                        }
                        {/* ----------------------------------------------------------------------------------------- */}
                    </form>}

                    {option === 'Tarjetas' && <form className="relative  pt-10" onSubmit={saveFrontPage2} >
                        <Link href={`/Admin/Edit/AddTarjetas?item=${query}`} className='fixed bottom-[100px] right-[100px]  rounded-full z-50 block font-medium '>
                            <div className="absolute top-5 left-5  p-1 border text-white border-white rounded-full h-[50px] w-[50px] text-center flex items-center justify-center bg-[#F1BA06]" >
                                ADD
                            </div>
                        </Link>
                        {/* ---------------------------------TARJETAS 3---------------------------------------- */}

                        {data3 && data3 !== undefined && Object.entries(data3).map((i) => {
                            return <div className="">


                                {i[0].includes(itemEdit) &&<div className={`flex items-center justify-between py-5 transition-all border-b-[.5px] border-[#666666] ${itemEdit === i[0]?' bg-gradient-to-t from-[#00195cbe] via-[#00195cbe] to-[#00195c]  p-5 text-white' :''} `} onClick={()=>itemEdit ==  i[0] ? setItemEdit(''):setItemEdit( i[0]) }>
                                    <span className='font-bold uppercase w-[50%]'>
                                        {i[1][`title`]}
                                    </span>
                                    <Link type='button' className=" bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 rounded-[20px] text-white font-bold py-2 px-4 " href={`/Admin/Edit/AddContent?item=${query}&route=${i[0]}`} >
                                        Mas contenido
                                    </Link>
                                </div>}
                                {itemEdit === i[0] && <div className='space-y-5'>
                                    <div className="w-full flex justify-center">
                                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 md:w-[250px] md:h-[200px]"
                                            style={{
                                                backgroundImage: `url(${i[1][`url`]})`,
                                                backgroundSize: 'contain',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center'
                                            }}
                                        >
                                            <div className="text-center flex flex-col justify-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF</p>
                                            </div>
                                        </div>
                                    </div>
                                    < InputFlotante type="text" name={`url`} id={`floating_5`} onChange={(e) => onChangeHandler3(e, i[0])} value={data2[i[0]] && data2[i[0]]['url'] ? data2[i[0]]['url'] : i[1][`url`]} required label={'IMG url'} shadow='shadow-white' />
                                    < InputFlotante type="text" name={`title`} id={`floating_6`} onChange={(e) => onChangeHandler3(e, i[0])} value={data2[i[0]] && data2[i[0]]['title'] ? data2[i[0]]['title'] : i[1][`title`]} required label={'Titulo'} shadow='shadow-white' />
                                    <label htmlFor="first-name" className="block text-[12px] font-medium leading-6 text-gray-900">Descripción</label>
                                    <TextEditorSimple value={i[1][`paragraph`]} setValue={(e) => onChangeHandler4(e, i[0])} edit={true} ></TextEditorSimple>
                                    <br />
                                    <div className='flex justify-center'>
                                        <Button type="button" theme="Danger" click={(e) => deleteHandler(e, `Cliente/${query}/tarjetas/${i[0]}`, i[0], setData3)}>Eliminar</Button>
                                        <Button type="submit" theme="Primary">Guardar</Button>
                                    </div>
                                </div>}

                            </div>
                        })
                        }
                        {/* ----------------------------------------------------------------------------------------- */}
                    </form>}


                </div>

            </div>


            {/* ---------------------------------Contactos---------------------------------------- */}

            {
                query === 'contactos' && <div className="fixed top-0 flex justify-center w-full h-auto bg-[#000000b4] p-0 z-40">
                    <form className="relative w-[95%] h-screen overflow-y-scroll lg:w-[50%] bg-white border-b border-gray-900/10 pt-16 pb-4 px-5" onSubmit={addContact}>
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Administrar contactos</h2>

                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-[12px] font-medium leading-6 text-gray-900">Departamento</label>
                                    <input type="text" name="departamento" className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente.contactos && cliente.contactos['departamento']} />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-[12px] font-medium leading-6 text-gray-900">Dirección 1</label>
                                    <input type="text" name="direccion 1" className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente.contactos && cliente.contactos['direccion 1']} />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-[12px] font-medium leading-6 text-gray-900">Dirección 2</label>
                                    <input type="text" name="direccion 2" className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente.contactos && cliente.contactos['direccion 2']} />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-[12px] font-medium leading-6 text-gray-900">Telefono</label>
                                    <input type="text" name="telefono" className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente.contactos && cliente.contactos['telefono']} />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-[12px] font-medium leading-6 text-gray-900">Celular</label>
                                    <input type="text" name="celular" className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente.contactos && cliente.contactos['celular']} />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-[12px] font-medium leading-6 text-gray-900">Facebook</label>
                                    <input type="text" name="facebook" className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente.contactos && cliente.contactos['facebook']} />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-[12px] font-medium leading-6 text-gray-900">TiK Tok</label>
                                    <input type="text" name="twiter" className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente.contactos && cliente.contactos['twiter']} />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block 
                                  text-[12px] font-medium leading-6 text-gray-900">Gmail</label>
                                    <input type="text" name="gmail" className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente.contactos && cliente.contactos['gmail']} />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-[12px] font-medium leading-6 text-gray-900">Instagram</label>
                                    <input type="text" name="instagram" className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente.contactos && cliente.contactos['instagram']} />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-[12px] font-medium leading-6 text-gray-900">Linkedin</label>
                                    <input type="text" name="linkedin" className="block w-full rounded-md border-0 p-1.5 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-[12px] sm:leading-6" defaultValue={cliente && cliente.contactos && cliente.contactos['linkedin']} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <Button type="submit" theme="Primary" >Guardar</Button>
                        </div>
                        <div className="absolute w-[50px] top-5 right-5 text-white p-1 rounded-tl-lg rounded-br-lg text-center bg-red-600" onClick={close}>
                            X
                        </div>
                    </form>
                </div>}



            {success === 'Cargando' && <Loader>ghfhfhj</Loader>}
        </div>



    )
}






