import { MessageBoxInputData } from 'element-ui/types/message-box';

export function isMessageBoxInputData(value: any): value is MessageBoxInputData {
    return value.hasOwnProperty('value');
}
