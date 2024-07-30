enum SwapComponentUiType {
  Mobile = 'Mobile',
  Web = 'Web',
}

interface ISwapProps {
  containerClassName?: string;
  componentUiType?: SwapComponentUiType;
}

export default function Swap({ componentUiType, containerClassName }: ISwapProps) {
  return (
    <div className={containerClassName}>
      {componentUiType === SwapComponentUiType.Mobile ? <div>swap mobile</div> : <div>swap web</div>}
    </div>
  );
}
