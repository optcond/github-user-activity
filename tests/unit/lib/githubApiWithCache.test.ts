import fs from "fs";
import { GithubApiWithCache } from "../../../src/lib/githubApiWithCache";
import { GithubApi } from "../../../src/lib/githubApi";

describe(`Cache decorator for github api`, () => {
  let api: GithubApiWithCache;
  let superRequestSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;
  let loadSpy: jest.SpyInstance;
  beforeEach(() => {
    api = new GithubApiWithCache("test", "./test-cache", 60 * 1000);
    superRequestSpy = jest
      .spyOn(GithubApi.prototype as any, "_processRequest")
      .mockImplementation(() => {
        return new Response(JSON.stringify({ some: "value" }), {
          status: 200,
        });
      });

    saveSpy = jest.spyOn(GithubApiWithCache.prototype as any, "_saveCache");
    loadSpy = jest.spyOn(GithubApiWithCache.prototype as any, "_loadCache");
  });
  afterEach(() => {
    try {
      for (let file of fs.readdirSync("./test-cache")) {
        fs.unlinkSync(`./test-cache/${file}`);
      }
      fs.rmdirSync("./test-cache");
    } catch (error) {
      console.log((error as Error).message);
    }
    jest.clearAllMocks();
  });
  it(`save cache`, async () => {
    await api.getEvents("abracadabra");
    expect(loadSpy).toHaveReturnedWith(null);
    expect(saveSpy).toHaveBeenCalled();

    loadSpy.mockClear();
    saveSpy.mockClear();
    superRequestSpy.mockClear();

    await api.getEvents("abracadabra");
    expect(superRequestSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();

    const responseData: any = loadSpy.mock.results[0].value;
    expect(responseData.status).toEqual(200);
    expect(responseData.ok).toEqual(true);
    expect(await responseData.json()).toEqual({ some: "value" });
  });
  it(`load cache with bad ttl`, async () => {
    api.updateTTL(-10 * 1000);

    await api.getEvents("abracadabra");
    expect(loadSpy).toHaveReturnedWith(null);
    expect(saveSpy).toHaveBeenCalled();

    loadSpy.mockClear();
    saveSpy.mockClear();
    superRequestSpy.mockClear();

    await api.getEvents("abracadabra");
    expect(loadSpy).toHaveReturnedWith(null);
    expect(saveSpy).toHaveBeenCalled();
  });
  it(`test multiple cached responses`, async () => {
    await api.getEvents("abracadabra");

    superRequestSpy.mockImplementationOnce(() => {
      return new Response(JSON.stringify({ another: "another value" }), {
        status: 200,
      });
    });
    await api.getEvents("other");

    loadSpy.mockClear();
    saveSpy.mockClear();
    superRequestSpy.mockClear();

    await api.getEvents("abracadabra");
    expect(superRequestSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();

    const responseData1: any = loadSpy.mock.results[0].value;
    expect(responseData1.status).toEqual(200);
    expect(responseData1.ok).toEqual(true);
    expect(await responseData1.json()).toEqual({ some: "value" });

    loadSpy.mockClear();
    saveSpy.mockClear();
    superRequestSpy.mockClear();

    await api.getEvents("other");
    expect(superRequestSpy).not.toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();

    const responseData2: any = loadSpy.mock.results[0].value;
    expect(responseData2.status).toEqual(200);
    expect(responseData2.ok).toEqual(true);
    expect(await responseData2.json()).toEqual({ another: "another value" });
  });
  it(`bad request not cached`, async () => {
    superRequestSpy.mockImplementationOnce(() => {
      return new Response(JSON.stringify({ some: "value" }), {
        status: 404,
      });
    });
    expect(saveSpy).not.toHaveBeenCalled();
  });
});
