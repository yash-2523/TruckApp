import Head from "next/head";


export default function HeadTags() {
    return (
        <Head>
            
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <meta
            name="description"
            content="Web site created using create-react-app"
            />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Lato&family=Mulish:wght@600&family=Roboto&display=swap" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous" />
            <link rel="icon" href="/favicon.ico" />
            <title>Create Next App</title>
        </Head>
    )
}
