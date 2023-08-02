function InfoTooltip({ linkImage, altImage, subtitle, onClose, isOpen, onSubmit }) {
    return (
        <div className={`popup info-tooltip ${isOpen && 'popup_opened'}`} onClick = {onClose}>
            <div className="info-tooltip__container" onClick = {e => {e.stopPropagation()}}>
                <div className="info-tooltip__image">
                    <img src={linkImage} alt={altImage} />
                </div>
                <p className="info-tooltip__subtitle">{subtitle}</p>
                <button className="button info-tooltip__close" type="button" onClick={onClose}/>
            </div>
        </div>
  )};
  
  export default InfoTooltip