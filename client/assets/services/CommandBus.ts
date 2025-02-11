import type { CommandType, ICommand, CommandMap } from "../models/commands";

export type CommandHandler<TCommand extends ICommand> = (command: TCommand) => Promise<void>;

export class CommandBus {
    private commandHandlers = {} as Record<CommandType, CommandHandler<any>[]>;

    public registerHandler<K extends CommandType>(commandType: K, handler: (command: CommandMap[K]) => Promise<void>) {
        this.commandHandlers[commandType] = this.commandHandlers[commandType] || [];
        this.commandHandlers[commandType].push(handler as CommandHandler<any>);
    }

    public unregisterHandler<K extends CommandType>(commandType: K, handler: (command: CommandMap[K]) => Promise<void>) {
        const handlers = this.commandHandlers[commandType] as CommandHandler<any>[];
        if (handlers) {
            const index = handlers.indexOf(handler as CommandHandler<any>);
            if (index >= 0) {
                handlers.splice(index, 1);
            }
        }
    }

    public async executeCommand(command: ICommand) {
        const handlers = this.commandHandlers[command.$type] as CommandHandler<typeof command>[];
        if (handlers) {
            for (const handler of handlers) {
                await handler(command);
            }
        }
    }
}
