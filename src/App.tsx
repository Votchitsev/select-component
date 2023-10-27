import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import options from './options.json';
import './App.css'
import style from './select.module.scss';

type SelectProps = {
  selected: Option | null;
  options: Option[];
  placeholder: string;
  status?: 'default' | 'invalid';
  onChange: (option: Option['value']) => void;
  onClose?: () => void;
};

type Option = {
  title: string;
  value: string;
}

type OptionProps = {
  option: Option;
  onClick: (value: Option['value']) => void;
}

function Select({ 
  options,
  placeholder,
  status = 'default',
  selected,
  onChange,
  onClose,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const { target } = e;
  
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        isOpen && onClose?.();
        setIsOpen(false);
      }
    }

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const placeholderEl = placeholderRef.current;

    if (!placeholderEl) return;

    const handleClick = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsOpen(!isOpen);
      }
    }

    placeholderEl.addEventListener('keydown', handleClick);

    return () => {
      placeholderEl.removeEventListener('keydown', handleClick);
    }
  }, []);

  const handleOptionClick = (value: Option['value']) => {
    onChange?.(value);
    setIsOpen(false);
  }

  const handlePlaceHolderClick = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div
      ref={rootRef}
      className={style.selectWrapper}
      data-is-active={isOpen}
    >
      <div className={ style.arrow }>
        <MdOutlineKeyboardArrowDown />
      </div>
      <div
        className={ style.placeholder }
        data-status={status}
        role='button'
        data-selected={!!selected?.value}
        tabIndex={0}
        onClick={handlePlaceHolderClick}
      >
        { selected?.title || placeholder}
      </div>
      { isOpen && (
        <ul className={ style.select }>
          { options.map(option => (
            <Option
              key={option.value}
              option={option}
              onClick={handleOptionClick}
            />
          )) }
        </ul>
      )}
    </div>
  )
}

function Option({ option, onClick }: OptionProps) {
  const optionRef = useRef<HTMLLIElement>(null);

  const handleClick = (clickedValue: Option['value']): MouseEventHandler<HTMLLIElement> =>
    () => {
      onClick(clickedValue);
    }

  useEffect(() => {
    const option = optionRef.current;

    if (!option) return;

    const handleEnterPress = (e: KeyboardEvent) => {
      if (document.activeElement === option && e.key === 'Enter') {
        onClick(String(option.value));
      }

      option.addEventListener('keydown', handleEnterPress);

      return () => {
        option.removeEventListener('keydown', handleEnterPress);
      }
    }
  }, [option.value, onClick]);

  return (
    <li
      className={ style.option }
      onClick={handleClick(option.value)}
      value={option.value}
      tabIndex={0}
    >
      { option.title }
    </li>
  )
}

function App() {
  const [month, setMonth] = useState('');
  const handleMonthSelect = (value: string) => {
    setMonth(value);
  }

  const selectedMonth = options.find(option => option.value === month);

  return (
    <div className={ 'App' }>
      <div className='Select'>
        <Select
          options={options}
          selected={selectedMonth || null}
          onChange={handleMonthSelect}
          placeholder='Select month'
        />
      </div>
    </div>
  )
}

export default App


