import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDay   = (y, m) => new Date(y, m, 1).getDay();

const toYMD = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formatDisplay = (ymd) => {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-');
  return `${d}/${m}/${y}`;
};

const todayYMD = () => toYMD(new Date());

/** Try to parse a typed string into YYYY-MM-DD. Returns null if invalid. */
const parseTyped = (text) => {
  if (!text || !text.trim()) return null;
  const t = text.trim();

  // dd/mm/yyyy  or  dd-mm-yyyy  or  dd.mm.yyyy
  const dmy = t.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    if (
      !isNaN(date.getTime()) &&
      date.getDate()     === parseInt(d, 10) &&
      date.getMonth()    === parseInt(m, 10) - 1 &&
      date.getFullYear() === parseInt(y, 10)
    ) return toYMD(date);
  }

  // yyyy-mm-dd  or  yyyy/mm/dd
  const ymd = t.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (ymd) {
    const [, y, m, d] = ymd;
    const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    if (!isNaN(date.getTime())) return toYMD(date);
  }

  return null;
};

// ── Styled ────────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LabelEl = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Req = styled.span`
  color: ${({ theme }) => theme.colors.error};
  margin-left: 2px;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1.5px solid ${({ $error, $focused, theme }) =>
    $error   ? theme.colors.error :
    $focused ? theme.colors.brandPrimary :
    theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  transition: border-color ${({ theme }) => theme.transitions.fast},
              box-shadow   ${({ theme }) => theme.transitions.fast};
  ${({ $focused, theme }) =>
    $focused && `box-shadow: 0 0 0 3px ${theme.colors.brandPrimary}22;`}

  &:hover {
    border-color: ${({ $error, $focused, theme }) =>
      $error   ? theme.colors.error :
      $focused ? theme.colors.brandPrimary :
      theme.colors.borderHover};
  }
`;

const TextInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 9px 12px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  min-width: 0;

  &::placeholder { color: ${({ theme }) => theme.colors.textTertiary}; }
`;

const CalToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 100%;
  min-height: 38px;
  flex-shrink: 0;
  background: transparent;
  border: none;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  color: ${({ $active, theme }) => $active ? theme.colors.brandPrimary : theme.colors.textTertiary};
  transition: color ${({ theme }) => theme.transitions.fast},
              background ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.brandPrimary};
    background: ${({ theme }) => `${theme.colors.brandPrimary}0e`};
  }

  svg { width: 15px; height: 15px; }
`;

const Hint = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin: 0;
`;

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
`;

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13), 0 2px 6px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  min-width: 276px;
  animation: dpFadeIn 0.12s ease;

  @keyframes dpFadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const CalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

const MonthLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const NavBtn = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.brandPrimary};
    border-color: ${({ theme }) => theme.colors.brandPrimary};
    color: white;
  }

  svg { width: 14px; height: 14px; }
`;

const CalBody = styled.div`
  padding: 12px;
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 6px;
`;

const WeekDay = styled.span`
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textTertiary};
  padding: 3px 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const DayBtn = styled.button`
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ $selected, $today }) => ($selected || $today) ? '600' : '400'};
  border: none;
  border-radius: 8px;
  cursor: ${({ $outside }) => ($outside ? 'default' : 'pointer')};
  background: ${({ $selected, theme }) => $selected ? theme.colors.brandPrimary : 'transparent'};
  color: ${({ $selected, $today, $outside, theme }) =>
    $selected ? 'white' :
    $outside  ? theme.colors.textMuted :
    $today    ? theme.colors.brandPrimary :
    theme.colors.textPrimary};
  position: relative;
  transition: background 0.12s, color 0.12s;
  visibility: ${({ $outside }) => $outside ? 'hidden' : 'visible'};

  ${({ $today, $selected, theme }) =>
    $today && !$selected && `
      &::after {
        content: '';
        position: absolute;
        bottom: 3px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: ${theme.colors.brandPrimary};
      }
    `}

  &:hover:not(:disabled) {
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.brandPrimary : theme.colors.bgHover};
  }
`;

const CalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSecondary};
`;

const FooterBtn = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.brandPrimary};
  cursor: pointer;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover { background: ${({ theme }) => `${theme.colors.brandPrimary}16`}; }
`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function DatePicker({
  label,
  required,
  error,
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
}) {
  const [open, setOpen]         = useState(false);
  const [focused, setFocused]   = useState(false);
  const [inputText, setInputText] = useState(() => formatDisplay(value));
  const [viewYear, setViewYear]   = useState(() => value ? parseInt(value.slice(0, 4)) : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.slice(5, 7)) - 1 : new Date().getMonth());
  const wrapperRef = useRef(null);
  const inputRef   = useRef(null);

  // Sync inputText when value changes externally (e.g. form reset)
  useEffect(() => {
    setInputText(formatDisplay(value));
    if (value) {
      setViewYear(parseInt(value.slice(0, 4)));
      setViewMonth(parseInt(value.slice(5, 7)) - 1);
    }
  }, [value]);

  // Close popover on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // ── Text input handlers ──────────────────────────────────────────────────

  const handleTextChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    const parsed = parseTyped(text);
    if (parsed) {
      onChange(parsed);
      setViewYear(parseInt(parsed.slice(0, 4)));
      setViewMonth(parseInt(parsed.slice(5, 7)) - 1);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    const parsed = parseTyped(inputText);
    if (parsed) {
      // Normalise display format
      setInputText(formatDisplay(parsed));
    } else {
      // Revert to last valid or clear
      setInputText(formatDisplay(value));
      if (!parseTyped(inputText)) onChange('');
    }
  };

  // ── Calendar handlers ────────────────────────────────────────────────────

  const prevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const selectDay = useCallback((e, day, isOutside) => {
    e.stopPropagation();
    if (isOutside) return;
    const ymd = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(ymd);
    setInputText(formatDisplay(ymd));
    setOpen(false);
    inputRef.current?.focus();
  }, [viewYear, viewMonth, onChange]);

  const selectToday = (e) => {
    e.stopPropagation();
    const today = todayYMD();
    onChange(today);
    setInputText(formatDisplay(today));
    setOpen(false);
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange('');
    setInputText('');
    setOpen(false);
    inputRef.current?.focus();
  };

  // ── Build calendar grid ──────────────────────────────────────────────────

  const firstDay   = getFirstDay(viewYear, viewMonth);
  const daysInMo   = getDaysInMonth(viewYear, viewMonth);
  const prevDaysIn = getDaysInMonth(viewYear, viewMonth - 1);
  const today      = todayYMD();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDaysIn - i, outside: true });
  for (let d = 1; d <= daysInMo; d++)      cells.push({ day: d, outside: false });
  while (cells.length < 42)               cells.push({ day: cells.length - firstDay - daysInMo + 1, outside: true });

  const cellYMD = (cell) =>
    cell.outside ? null :
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;

  return (
    <Wrapper ref={wrapperRef}>
      <FormGroup>
        {label && (
          <LabelEl>
            {label}{required && <Req>*</Req>}
          </LabelEl>
        )}

        <InputRow $error={!!error} $focused={focused || open}>
          <TextInput
            ref={inputRef}
            value={inputText}
            onChange={handleTextChange}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
          />
          <CalToggle
            type="button"
            $active={open}
            onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
            title="Open calendar"
          >
            <Calendar />
          </CalToggle>
        </InputRow>

        {error
          ? <ErrorText>{error}</ErrorText>
          : <Hint>Type DD/MM/YYYY or pick from the calendar</Hint>
        }
      </FormGroup>

      {open && (
        <Popover>
          <CalHeader>
            <NavBtn onClick={prevMonth}><ChevronLeft /></NavBtn>
            <MonthLabel>{MONTHS_FULL[viewMonth]} {viewYear}</MonthLabel>
            <NavBtn onClick={nextMonth}><ChevronRight /></NavBtn>
          </CalHeader>

          <CalBody>
            <WeekRow>
              {WEEKDAYS.map((d) => <WeekDay key={d}>{d}</WeekDay>)}
            </WeekRow>
            <DaysGrid>
              {cells.map((cell, i) => {
                const ymd = cellYMD(cell);
                return (
                  <DayBtn
                    key={i}
                    type="button"
                    $selected={ymd === value}
                    $today={ymd === today}
                    $outside={cell.outside}
                    onClick={(e) => selectDay(e, cell.day, cell.outside)}
                  >
                    {cell.day}
                  </DayBtn>
                );
              })}
            </DaysGrid>
          </CalBody>

          <CalFooter>
            <FooterBtn type="button" onClick={clear}>Clear</FooterBtn>
            <FooterBtn type="button" onClick={selectToday}>Today</FooterBtn>
          </CalFooter>
        </Popover>
      )}
    </Wrapper>
  );
}
