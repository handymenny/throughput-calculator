import { type Signal, component$, useSignal, useTask$ } from '@builder.io/qwik';
import SelectInput from '../input/select-input';
import { getOverhead, unquantizedTbsOverhead } from '~/helpers/calculator';
import type { FreqRangeType, Overhead } from '~/@types/layer-nr';
import NumberInput from '../input/number-input';
import Dmrs from './dmrs';

interface Props {
  selectedRange: FreqRangeType;
  selectedValue?: Signal<Overhead>;
}

export default component$(({ selectedValue, selectedRange }: Props) => {
  const overheadType = useSignal<string>('max-data-rate');

  const scheduledSymbolsDL = useSignal<number>(13);
  const scheduledSymbolsUL = useSignal<number>(14);
  const dmrsREsDL = useSignal<number>(12);
  const dmrsREsUL = useSignal<number>(12);
  const xOverheadDL = useSignal<string>('0');
  const xOverheadUL = useSignal<string>('0');

  const overheadOptions = [
    {
      label: 'TS 38.306 4.1.2 - Supported max data rate',
      value: 'max-data-rate',
    },
    { label: 'TS 38.214 5.1.3.2 - Unquantized TBS', value: 'tbs' },
  ];

  const xOverheadOptions = [
    { label: '0', value: '0' },
    { label: '6', value: '6' },
    { label: '12', value: '12' },
    { label: '18', value: '18' },
  ];

  useTask$(({ track }) => {
    track(() => overheadType.value);
    track(() => scheduledSymbolsDL.value);
    track(() => scheduledSymbolsUL.value);
    track(() => dmrsREsDL.value);
    track(() => dmrsREsUL.value);
    track(() => xOverheadDL.value);
    track(() => xOverheadUL.value);
    track(() => selectedRange);

    if (selectedValue == null) return;

    const overhead = { dl: 0, ul: 0 };

    if (overheadType.value == 'max-data-rate') {
      overhead.dl = getOverhead(selectedRange, 'dl');
      overhead.ul = getOverhead(selectedRange, 'ul');
    } else {
      overhead.dl = unquantizedTbsOverhead(
        parseInt(xOverheadDL.value),
        scheduledSymbolsDL.value,
        dmrsREsDL.value,
      );
      overhead.ul = unquantizedTbsOverhead(
        parseInt(xOverheadUL.value),
        scheduledSymbolsUL.value,
        dmrsREsUL.value,
      );
    }

    selectedValue.value = overhead;
  });

  return (
    <>
      <SelectInput
        label={'Overhead'}
        selectedValue={overheadType}
        options={overheadOptions}
      />
      <NumberInput
        label={'DL Scheduled Symbols'}
        labelClass="text-center"
        selectedValue={scheduledSymbolsDL}
        max={14}
        min={0}
        hidden={overheadType.value == 'max-data-rate'}
      />
      <NumberInput
        label={'UL Scheduled Symbols'}
        labelClass="text-center"
        selectedValue={scheduledSymbolsUL}
        max={14}
        min={0}
        hidden={overheadType.value == 'max-data-rate'}
      />
      <Dmrs
        prefix={'DL'}
        selectedValue={dmrsREsDL}
        hidden={overheadType.value == 'max-data-rate'}
      />
      <Dmrs
        prefix={'UL'}
        selectedValue={dmrsREsUL}
        hidden={overheadType.value == 'max-data-rate'}
      />
      <SelectInput
        label={'DL xOverhead'}
        labelClass="text-center"
        selectedValue={xOverheadDL}
        options={xOverheadOptions}
        hidden={overheadType.value == 'max-data-rate'}
      />
      <SelectInput
        label={'UL xOverhead'}
        labelClass="text-center"
        selectedValue={xOverheadUL}
        options={xOverheadOptions}
        hidden={overheadType.value == 'max-data-rate'}
      />
    </>
  );
});
