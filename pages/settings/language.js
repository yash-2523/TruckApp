import { useTranslation } from "react-i18next";
import { useState } from "react"
import { Button } from "@material-ui/core";

const Language = () => {
    const { t, i18n } = useTranslation();
    const [lng, setLng] = useState('en');
    const handleSubmit = (e) => {
        e.preventDefault();
        i18n.changeLanguage(lng);
        console.log(lng)
    }
    return (
        <div className="w-100 py-md-1 px-md-3 py-4 px-2">
            <div className="custom_container p-3">
                <h1>{t('Select the language of the application')}</h1>
                <form onSubmit={e => handleSubmit(e)}>
                    <div onChange={e => setLng(e.target.value)}>
                        <input type="radio" value="en" name="language" /> English
                        <input type="radio" value="hi" name="language" /> Hindi
                        <input type="radio" value="hn" name="language" /> Hinglish
                    </div>
                    <Button type="submit" variant='contained' color='primary'>Save</Button>
                </form>


            </div>
        </div>
    );
}

export default Language;