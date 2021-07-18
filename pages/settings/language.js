import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react"
import { Button } from "@material-ui/core";

const Language = () => {
    const { t, i18n } = useTranslation();
    const [lng, setLng] = useState('en');

    useEffect(() => {
        setLng(i18n.language)
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault();
        i18n.changeLanguage(lng);
    }
    return (
        <div className="w-100 py-md-1 px-md-3 py-4 px-2">
            <div className="custom_container p-3">
                <h4>{t('Select the language of the application')}</h4>
                <form onSubmit={e => handleSubmit(e)}>
                    <div onChange={e => setLng(e.target.value)}>
                        <input type="radio" value="en" name="language" checked={true ? lng == 'en' : false} /> English
                        <input type="radio" value="hi" name="language" checked={true ? lng == 'hi' : false} /> Hindi
                        <input type="radio" value="hinglish" name="language" checked={true ? lng == 'hinglish' : false} /> Hinglish
                    </div>
                    <Button type="submit" variant='contained' color='primary'>Save</Button>
                </form>


            </div>
        </div>
    );
}

export default Language;