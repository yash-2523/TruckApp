import { Dialog, DialogTitle, DialogActions,Button, DialogContent } from "@material-ui/core"
import { Cancel } from "@material-ui/icons";
import { useRef } from "react";
import SignaturePad from 'react-signature-canvas'


export default function SignaturePadDialog(props){

    const sigCanvas = useRef({})

    return (
        <Dialog open={props.open} onClose={props.close} fullWidth maxWidth="lg" className="signature-pad-dialog">
            <DialogActions><Cancel onClick={props.close} /></DialogActions>
            <DialogTitle>Draw Your Signature</DialogTitle>
            <DialogContent>
                <SignaturePad ref={sigCanvas} backgroundColor="rgba(245, 245, 245, 1)" canvasProps={{className: "signature-pad"}}  />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => sigCanvas.current.clear()}>Clear</Button>
                <Button variant="contained" className="save-btn" onClick={() => props.save(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"))}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}