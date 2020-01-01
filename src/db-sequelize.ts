import { Sequelize, SequelizeOptions } from "sequelize-typescript";

// @ts-ignore
import mysql2 from "mysql2";

export const db: any = {};
export default async function connect(
  sequelizeOptions?: SequelizeOptions | undefined
) {
  if (!sequelizeOptions) {
    console.log("Settings API: Sequelize disabled;");
    return;
  }
  console.log("Settings API: Sequelize enabled;");
  const options: SequelizeOptions = {
    dialect: "mysql",
    dialectModule: mysql2,
    repositoryMode: true,
    ...sequelizeOptions
  };

  try {
    const sequelize = new Sequelize(options);
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return await new Promise(res => {
      return res(sequelize);
    }).then(
      async () => {
        const dbVersion = await sequelize.databaseVersion();
        console.log(
          `🆙  Connected to Sequelize: ${dbVersion}/${sequelizeOptions.host}`
        );
      },
      async err => {
        const dbVersion = await sequelize.databaseVersion();
        console.error(
          `📴 Failed to connect on Sequelize: ${dbVersion}/${sequelizeOptions.host}\nErr: ${err}`
        );
        setTimeout(async () => {
          await connect(sequelizeOptions);
        }, 5000);
      }
    );
  } catch (err) {
    console.error(
      `📴 Failed to connect on Sequelize: ${sequelizeOptions.host}\nErr: ${err}`
    );
    setTimeout(async () => {
      await connect(sequelizeOptions);
    }, 5000);
  }
  return null;
}
